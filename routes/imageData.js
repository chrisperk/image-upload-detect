import express from 'express'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// Create images router
const router = express.Router()

// Set up Image Get resources
router.get('/:filename', (req, res) => {
    const { filename } = req.params
    const __dirname = dirname(fileURLToPath(import.meta.url))

    const fileLocation = path.join(__dirname + '/../imageData', filename)
    
    res.sendFile(`${fileLocation}`)
})

export default router