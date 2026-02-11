const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        default: null,
        lowercase: true
    },
    price: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    totalStock: {
        type: Number,
        default: null
    },
    currentStock: {
        type: Number,
        default: null
    },
    image: {
        type: String,
        default: null
    },

}, { timestamps: true })

module.exports = mongoose.model('product', productSchema)