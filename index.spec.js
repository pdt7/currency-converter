const request = require('supertest')
const express = require('express')
const app = express()
app.use(express.json())
//API routes
const transactionRouters = require('./routes/transactionRoutes')

app.use('/transaction', transactionRouters)

describe('Test My Currency Converter', () => {
    it('should get main route', async () => {
        const res = await request(app).get('/')
        expect(res).toHaveProperty('statusCode')
    })
})