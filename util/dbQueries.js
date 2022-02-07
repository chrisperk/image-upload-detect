import knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import got from 'got'
import { default as FormData } from 'form-data'
import fs from 'fs'

export const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'me',
        password: 'password',
        database: 'inspector_object',
    },
})

export const postImage = (req, res) => {
    const { filename, mimetype, size } = req.file
    const filepath = req.file.path
    let { label, enableObjectDetection } = req.body

    if (!label) label = `img_${uuidv4()}`

    db.insert({
        filename,
        filepath,
        mimetype,
        size,
        label,
        enableobjectdetection: enableObjectDetection
    })
        .into('image_files')
        .returning('id')
        .then(async (id) => {
            if (enableObjectDetection.toLowerCase() === 'true') {
                let objectsDetected = await uploadImage(filepath, id)

                objectsDetected = JSON.parse(objectsDetected[0].replace("{", "[").replace("}", "]"))
    
                res.status(200).json({ id, filename, filepath, mimetype, size, label, enableObjectDetection, objectsDetected,})
            } else {
                res.status(200).json({ id, filename, filepath, mimetype, size, label, enableObjectDetection,})
            }
        })
        .catch(err => res.status(500).json(
            { 
                success: false,
                message: 'upload failed',
                stack: err.stack,
            })
        )
}

export const getImages = (req, res) => {
    db.select('id', 'filename', 'filepath', 'mimetype', 'size', 'label', 'enableobjectdetection as enableObjectDetection', 'objectsdetected as objectsDetected')
        .from('image_files')
        .then(images => {
            if (images) {
                images = images.map(image => {
                    if (image.objectsDetected) {
                        image.objectsDetected = JSON.parse(image.objectsDetected[0].replace("{", "[").replace("}", "]"))
                    } else {
                        const {objectsDetected, ...newImage} = image
                        image = newImage
                    }
                    return image;
                })

                if (req.query.objects) {
                    const objectsToFilter = req.query.objects.split(',')
                    images = images.filter(image => {
                        for (let i = 0; i < objectsToFilter.length; i++) {
                            if (image.objectsDetected.includes(objectsToFilter[i])) {
                                return image
                            }
                        }
                    })
                }
                
                return res.status(200).json(images)
            }
            return Promise.reject(
                new Error('No images found')
            )
        })
        .catch(err => res
            .status(404)
            .json({
                success: false, 
                message: 'not found', 
                stack: err.stack,
            })
        )
}

export const getImageById = (req, res) => {
    const { id } = req.params
    db.select('id', 'filename', 'filepath', 'mimetype', 'size', 'label', 'enableobjectdetection as enableObjectDetection', 'objectsdetected as objectsDetected')
        .from('image_files')
        .where({ id })
        .then(images => {
            if (images[0]) {
                if (images[0].objectsDetected) {
                        images[0].objectsDetected = JSON.parse(images[0].objectsDetected[0].replace("{", "[").replace("}", "]"))
                    } else {
                        const {objectsDetected, ...newImage} = images[0]
                        images[0] = newImage
                    }

                return res.status(200).json(images[0])
            }
            return Promise.reject(
                new Error('Image does not exist')
            )
        })
        .catch(err => res
            .status(404)
            .json({
                success: false, 
                message: 'not found', 
                stack: err.stack,
            })
        )
}

const apiKey = 'acc_5d586a89a42243a'
const apiSecret = '29aeced6ffaedc4f8943f1d844c64d47'

const uploadImage = (path, imageId) => {
    return new Promise((resolve) => {
        const formData = new FormData()
        formData.append('image', fs.createReadStream(path))

        got.post('https://api.imagga.com/v2/tags', {body: formData, username: apiKey, password: apiSecret})
            .then(response => {
                const data = JSON.parse(response.body);
                const objectTags = data.result.tags.map(tag => tag.tag.en);

                db('image_files')
                    .where('id', imageId[0].id)
                    .update({ 
                        objectsdetected: db.raw('array_append(objectsdetected, ?)', [objectTags])
                    })
                    .returning('objectsdetected')
                    .then(objectsDetected => resolve(objectsDetected[0].objectsdetected))
            })
            .catch(error => {
                throw new Error(error);
            })
    })
}