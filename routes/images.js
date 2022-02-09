import express from 'express'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { 
    postImage,
    getImages,
    getImageById,
} from '../util/dbQueries.js'

// Create images router
const router = express.Router()

// Use multer to save attached request image on server filesystem
const storage = multer.diskStorage({
    destination: 'imageData',
    // Save user uploaded image with original file name
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const uploadImage = multer({storage: storage}).single('image')

// Set up Image Upload resource
router.post('/', uploadImage, postImage)

// Set up Image Get resources
router.get('/', getImages)
router.get('/:id', getImageById)

export default router