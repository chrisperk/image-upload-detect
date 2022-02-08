import knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import { analyzeImage } from '../services/imaggaService.js'

// Configure DB connection with knex
export const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
    },
})

// Routine to post image to db, conditionally calling Imagga for object detection
export const postImage = (req, res) => {
    const { filename, mimetype, size, } = req.file
    const filepath = req.file.path
    let { label, enableObjectDetection, } = req.body

    // If request label is not provided create a unique label with uuid
    if (!label) label = `img_${uuidv4()}`

    // Insert new row with image data 
    db.insert({
        filename,
        filepath,
        mimetype,
        size,
        label,
        enableobjectdetection: enableObjectDetection,
    })
        .into('image_files')
        .returning('id')
        .then(async (id) => {
            // If request dictates image objects be detected call Imagga API for analysis and persist in DB
            if (enableObjectDetection.toLowerCase() === 'true') {
                let objectsDetected = await analyzeImage(filepath, id)

                // Parse returned text array from DB to JSON array
                objectsDetected = JSON.parse(objectsDetected[0].replace("{", "[").replace("}", "]"))

                // Return 200 response with persisted image data and objects detected
                res.status(200).json({ id, filename, filepath, mimetype, size, label, enableObjectDetection, objectsDetected,})
            // Else insert row with null objectsDetected column
            } else {
                // Return 200 response with persisted image data
                res.status(200).json({ id, filename, filepath, mimetype, size, label, enableObjectDetection,})
            }
        })
        // Return 500 error if call for image analysis or DB insert fails
        .catch(err => res.status(500).json(
            { 
                success: false,
                message: 'Image upload failed',
                stack: err.stack,
            })
        )
}

// Routine to retrieve all images with optional objects query param filter
export const getImages = (req, res) => {
    // Retrieve all image file rows from DB
    db.select('id', 'filename', 'filepath', 'mimetype', 'size', 'label', 'enableobjectdetection as enableObjectDetection', 'objectsdetected as objectsDetected')
        .from('image_files')
        .then(images => {
            if (images) {
                images = images.map(image => {
                    // If objectsDetected column is populated parse returned text array from DB to JSON array
                    if (image.objectsDetected) {
                        image.objectsDetected = JSON.parse(image.objectsDetected[0].replace("{", "[").replace("}", "]"))
                    // Else remove null objectsDetected propert from image for response
                    } else {
                        const {objectsDetected, ...newImage} = image
                        image = newImage
                    }
                    return image;
                })

                // If request dictates only images with desired objects return get queried objects and filter collection for each
                if (req.query.objects) {
                    // Split requested objects into array
                    const objectsToFilter = req.query.objects.split(',')
                    // Filter image collection for desired objects
                    images = images.filter(image => {
                        // Check each image in collection for each desired object
                        for (let i = 0; i < objectsToFilter.length; i++) {
                            if (image.objectsDetected && image.objectsDetected.includes(objectsToFilter[i])) {
                                return image
                            }
                        }
                    })
                }
                
                // Return 200 response with images retrieved from DB and conditionally filtered
                // If no image rows are present in DB, a 200 will return with empty array as body
                return res.status(200).json(images)
            }
            // Reject promise if image retrieval from DB fails
            return Promise.reject(
                new Error('Image retrieval failed')
            )
        })
        // Return 500 error if DB retrieval fails
        .catch(err => res
            .status(500)
            .json({
                success: false, 
                message: 'Image retrieval failed', 
                stack: err.stack,
            })
        )
}

// Routine to get image by id
export const getImageById = (req, res) => {
    const { id } = req.params
    // Retrieve image with deired id from DB
    db.select('id', 'filename', 'filepath', 'mimetype', 'size', 'label', 'enableobjectdetection as enableObjectDetection', 'objectsdetected as objectsDetected')
        .from('image_files')
        .where({ id })
        .then(images => {
            if (images[0]) {
                // If objectsDetected column is populated parse returned text array from DB to JSON array
                if (images[0].objectsDetected) {
                    images[0].objectsDetected = JSON.parse(images[0].objectsDetected[0].replace("{", "[").replace("}", "]"))
                // Else remove null objectsDetected propert from image for response
                } else {
                    const {objectsDetected, ...newImage} = images[0]
                    images[0] = newImage
                }

                // Return 200 response with retrieved image's data
                return res.status(200).json(images[0])
            }

            // If image id is not located in DB reject the promise
            return Promise.reject(
                new Error('Image does not exist')
            )
        })
        // Return 404 response if image is not located in DB
        .catch(err => res
            .status(404)
            .json({
                success: false, 
                message: 'Image not found', 
                stack: err.stack,
            })
        )
}

// Routine to update image object tags
export const updateImageObjectTags = (response, imageId, resolve) => {
    // Map returned objects detected into array of strings
    const objectTags = JSON.parse(response.body).result.tags.map(tag => tag.tag.en)

    // Update image row's objectsdetected column with returned objects detected
    db('image_files')
        .where('id', imageId[0].id)
        .update({ 
            objectsdetected: db.raw('array_append(objectsdetected, ?)', [objectTags])
        })
        .returning('objectsdetected')
        // Return persisted objects detected to include in POST /images response
        .then(objectsDetected => resolve(objectsDetected[0].objectsdetected))
}