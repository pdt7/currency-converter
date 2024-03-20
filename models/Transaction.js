const mongoose = require('mongoose')

const Transaction = mongoose.model('Transaction', {
    transaction_id : Number,
    user_id : Number,
    origin_currency : String,
    origin_value : Number,
    destination_currency : String,
    conversion_rate : Number
})

module.exports = Transaction