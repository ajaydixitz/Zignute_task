const mongoose = require('mongoose')
const { deviceType } = require('../helpers/appConstants')
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        default: null,
        lowercase: true
    },
    password: {
        type: String,
        default: null
    },
    deviceToken: {
        type: String,
        default: null
    },
    deviceType: {
        type: String,
        default: null,
    },
}, { timestamps: true })


module.exports = mongoose.model('admin', adminSchema)
