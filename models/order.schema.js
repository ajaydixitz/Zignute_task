const mongoose = require('mongoose')
const { orderStatus } = require('../helpers/appConstants')

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        default: null
    },
    amount: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        default: orderStatus?.created
    }
}, { timestamps: true })

orderSchema.index({ userId: 1 })
module.exports = mongoose.model('order', orderSchema)