const mongoose = require('mongoose')

const Transaction = mongoose.model('Transaction', {
    user_id : Number,
    origin_currency : String,
    origin_value : Number,
    destination_currency : String,
    destination_value : Number,
    conversion_rate : Number,
    
})

module.exports = Transaction