import got from 'got'
import { default as FormData } from 'form-data'
import fs from 'fs'
import { updateImageObjectTags } from '../util/dbQueries.js'

const apiKey = 'acc_5d586a89a42243a'
const apiSecret = process.env.IMAGGA_API_KEY

export const uploadImage = (path, imageId) => {
    return new Promise((resolve) => {
        const formData = new FormData()
        formData.append('image', fs.createReadStream(path))

        got.post('https://api.imagga.com/v2/tags', {body: formData, username: apiKey, password: apiSecret})
            .then(response => updateImageObjectTags(response, imageId, resolve))
            .catch(error => {
                throw new Error(error);
            })
    })
}