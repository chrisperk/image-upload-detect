import morgan from 'morgan'
import express from 'express'
import multer from 'multer'
import knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import bodyParser from 'body-parser'

import imagesRouter from './routes/images.js'
// import { uploadImage, getObjectsDetected } from './services/imaggaService.js'

import got from 'got'
import { default as FormData } from 'form-data'
import fs from 'fs'

// Create express object
const app = express()

// Set middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/images', imagesRouter);

// Run express server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})