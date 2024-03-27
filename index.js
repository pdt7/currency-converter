// json read
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger.json')

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())
//API routes
const transactionRouters = require('./routes/transactionRoutes')

app.use('/transaction', transactionRouters)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@currency-converter-clus.tzqp1lz.mongodb.net/?retryWrites=true&w=majority&appName=currency-converter-cluster`)
.then(() => {
    console.log('MongoDB connected!')
    app.listen(3000)
})
.catch((err) => console.log(err))
//port to listen