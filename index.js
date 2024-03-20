// json read
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/Transaction')

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())
//API routes

app.post('/transaction', async (req, res) => {
    const {transaction_id,
        user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate} = req.body
    
    const person = {transaction_id,
        user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate
    }

    try{

        await Person.create(person)
        res.status(201).json({message: 'transacao inserida com sucesso!'})

    }catch (error){
        res.status(500).json({error: error})
    }
})

//inital route/endpoint
app.get('/', (req, res) => {
    // show request
    res.json({message: 'Oi Express!!' })
})

const DB_USER = 'paulodt'
const DB_PASSWORD = encodeURIComponent('KCKQb9uu4KwCBjuc')

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@currency-converter-clus.tzqp1lz.mongodb.net/?retryWrites=true&w=majority&appName=currency-converter-cluster`)
.then(() => {
    console.log('Conectamos ao MongoDB!')
    app.listen(3000)
})
.catch((err) => console.log(err))
//port to listen