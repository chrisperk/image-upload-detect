import  express from 'express'
import multer from 'multer'
import { 
    postImage,
    getImages,
    getImageById,
} from '../util/dbQueries.js'

// Create images router
const router = express.Router()

// Create multer object to save image on server filesystem
const imageUpload = multer({
    dest: 'images',
})

// Set up Image Upload resource
router.post('/', imageUpload.single('image'), postImage)

// Set up Image Get resources
router.get('/', getImages)
router.get('/:id', getImageById)

export default router