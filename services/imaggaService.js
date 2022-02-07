import got from 'got'
import { default as FormData } from 'form-data'
import fs from 'fs'

const apiKey = 'acc_5d586a89a42243a'
const apiSecret = '29aeced6ffaedc4f8943f1d844c64d47'

export const uploadImage = () => {
    const filePath = '../images/cat-hat.jpg';
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    (async () => {
        try {
            const response = await got.post('https://api.imagga.com/v2/tags', {body: formData, username: apiKey, password: apiSecret});
            console.log(response.body);
        } catch (error) {
            console.log(error);
        }
    })();
}

export const getObjectsDetected = () => {
    const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';
    const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

    (async () => {
        try {
            const response = await got(url, {username: apiKey, password: apiSecret});
            console.log(response.body);
        } catch (error) {
            console.log(error.response.body);
        }
    })();
}