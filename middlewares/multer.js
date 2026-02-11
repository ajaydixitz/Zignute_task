const multer = require('multer')
const path = require('path')
const { msgConstant, responseStatus, postType } = require('../helpers/appConstants')
const utils = require('../helpers/utils')
const { requestDecryptor } = require('../helpers/decryptor')

module.exports.multerForUser = (req, res, next) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/user')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + "_" + file.originalname)
            }
        })
    }).single('image')(req, res, (err) => {

        if (err) {
            res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidFileUpload))
        }
        else requestDecryptor(req, res, next, true)
    })
}

module.exports.multerForProduct = (req, res, next) => {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/product')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + "_" + file.originalname)
            }
        })
    }).single('image')(req, res, (err) => {

        if (err) {
            res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidFileUpload))
        }
        else requestDecryptor(req, res, next, true)
    })
}