import  express from 'express'
import multer from 'multer'
import { 
    postImage,
    getImages,
    getImageById,
} from '../util/dbQueries.js'
// import { uploadImage, getObjectsDetected } from './services/imaggaService.js'

const router = express.Router()

// Create multer object to save image on server filesystem
const imageUpload = multer({
    dest: 'images',
})

// Image Upload Routes
router.post('/', imageUpload.single('image'), postImage)

// Image Get Routes
router.get('/', getImages)
router.get('/:id', getImageById)

export default router