const { Router } = require('express')

const router = require('express').Router()

const Transaction = require('../models/Transaction')

// create transaction
router.post('/', async (req, res) => {
    const {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate} = req.body
    
    if(!origin_currency){
        res.status(422).json({error : 'O nome é obrigatorio!'})
    }

    const transaction = {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate
    }

    try{

        await Transaction.create(transaction)
        res.status(201).json({message: 'transacao inserida com sucesso!'})

    }catch (error){
        res.status(500).json({error: error})
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try{
        const transaction = await Transaction.findOne({_id: id})
        if(!transaction){
            res.status(422).json({message : "Transacao nao encontrada"})
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
            res.status(404).json({message : "Transacao nao encontrada"})
            return
        }
        res.status(200).json(transaction)
    }catch(error){
        res.status(500).json({ error: error})
    }
})

//update - PUT or PATCH
router.patch('/:id', async (req, res) => {
    console.log(req)
    const id = req.params.id

    const {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate} = req.body
    
    const transaction = {user_id,
        origin_currency,
        origin_value,
        destination_currency,
        conversion_rate
    }
    
    try{
        const updateTransaction = await Transaction.updateOne({_id: id}, transaction)

        console.log(updateTransaction)

        if(updateTransaction.matchedCount == 0){
            res.status(404).json({message : "Transacao nao encontrada"})
            return
        }
        res.status(200).json(transaction)
    }catch(error){
        res.status(500).json({ error: error})
    }
})

//delete
router.delete('/:id', async(req, res) => {
    const id = req.params.id
    try{
        const transaction = await Transaction.findOne({_id: id})
        if(!transaction){
            res.status(422).json({message : "Transacao nao encontrada"})
            return
        }
        await Transaction.deleteOne({_id: id})
        res.status(200).json({message : "Usuario removido com sucesso"})
    }catch{
        res.status(500).json({error: error})
    }
})

module.exports = router