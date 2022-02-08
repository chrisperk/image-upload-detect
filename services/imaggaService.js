import got from 'got'
import { default as FormData } from 'form-data'
import fs from 'fs'
import { updateImageObjectTags } from '../util/dbQueries.js'

// Set up Imagga api credentials from .env file
const apiKey = process.env.IMAGGA_API_KEY
const apiSecret = process.env.IMAGGA_API_SECRET

export const analyzeImage = (path, imageId) => {
    // Create promise for async/await API call
    return new Promise((resolve) => {
        // Use form-data to attach image file to API request
        const formData = new FormData()
        formData.append('image', fs.createReadStream(path))

        got.post('https://api.imagga.com/v2/tags', {body: formData, username: apiKey, password: apiSecret})
            // Update image files in DB with objects detected by Imagga
            .then(response => updateImageObjectTags(response, imageId, resolve))
            .catch(error => {
                throw new Error(error);
            })
    })
}