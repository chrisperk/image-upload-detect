import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import dotenv  from 'dotenv'

import imagesRouter from './routes/images.js'

// Initialize vars from .env file
dotenv.config();

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

// Set images router
app.use('/images', imagesRouter);

// Run express server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})