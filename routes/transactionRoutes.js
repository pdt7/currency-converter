const { Router } = require('express')

const router = require('express').Router()

const Transaction = require('../models/Transaction')
const { now } = require('mongoose')

// create transaction
router.post('/', async (req, res) => {
    const {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate,
        date} = req.body
    
    if(!origin_currency){
        res.status(422).json({error : 'Origin currency is mandatory!'})
    }

    if(!user_id){
        res.status(422).json({error : 'User id is mandatory!'})
    }

    if(!destination_currency){
        res.status(422).json({error : 'destination currency is mandatory!'})
    }

    if(!origin_value){
        res.status(422).json({error : 'Origin value is mandatory!'})
    }


    const transaction = {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate,
        date
    }

    try{

        var myHeaders = new Headers();
        myHeaders.append("apikey", "PaIk95bwZCPFj4ZHA4bh0ooHxOPaLpLc");
        
        var requestOptions = {
          method: 'GET',
          redirect: 'follow',
          headers: myHeaders
        };
        
        console.log("https://api.apilayer.com/currency_data/convert?to="+destination_currency+"&from="+origin_currency+"&amount="+origin_value)
        const response = await fetch("https://api.apilayer.com/currency_data/convert?to="+origin_currency+"&from="+destination_currency+"&amount="+origin_value, requestOptions)
        //const response = await fetch("https://api.exchangeratesapi.io/latest?base=EUR", requestOptions)
        const dados = await response.json();
        
        transaction.conversion_rate = dados.quote; //recuperar da API
        //transaction.destination_value = transaction.conversion_rate * origin_value
        const myDate = new Date().toISOString()
        transaction.date = myDate
        await Transaction.create(transaction)
        res.status(201).json({
            "transaction_id": transaction._id,
            "user_id": transaction.user_id,
            "origin_currency": transaction.origin_currency,
            "origin_value": transaction.origin_value,
            "destination_currency" : transaction.destination_currency,
            "destination_value": transaction.conversion_rate * origin_value,
            "conversion_rate": transaction.conversion_rate,
            "date": transaction.date
        })

    }catch (error){
        res.status(500).json({error: error})
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try{
        const transaction = await Transaction.findOne({_id: id})
        if(!transaction){
            res.status(422).json({message : "Transaction not found"})
            return
        }
        res.status(200).json(transaction)
    }catch{
        res.status(500).json({error: error})
    }
})

router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try{
        const transaction = await Transaction.findOne({"user_id":id})
        if(!transaction){
            res.status(422).json({message : "User not found"})
            return
        }
        res.status(200).json(transaction)
    }catch{
        res.status(500).json({error: error})
    }
})

//read data
router.get('/', async (req, res) => {
    try{
        const transaction = await Transaction.find()
        if(!transaction){
            res.status(404).json({message : "Transaction not found"})
            return
        }
        res.status(200).json(transaction)
    }catch(error){
        res.status(500).json({ error: error})
    }
})

//update - PATCH
router.patch('/:id', async (req, res) => {
    console.log(req)
    const id = req.params.id

    const {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate,
        date} = req.body
    
    const transaction = {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate,
        date
    }
    
    try{
        const updateTransaction = await Transaction.updateOne({_id: id}, transaction)

        console.log(updateTransaction)

        if(updateTransaction.matchedCount == 0){
            res.status(404).json({message : "Transaction not found"})
            return
        }
        res.status(200).json(transaction)
    }catch(error){
        res.status(500).json({ error: error})
    }
})

//delete transaction
router.delete('/:id', async(req, res) => {
    const id = req.params.id
    try{
        const transaction = await Transaction.findOne({_id: id})
        if(!transaction){
            res.status(422).json({message : "Transaction not found"})
            return
        }
        await Transaction.deleteOne({_id: id})
        res.status(200).json({message : "Transaction removed sucessfully"})
    }catch{
        res.status(500).json({error: error})
    }
})

module.exports = router