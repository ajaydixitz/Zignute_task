const utils = require('../helpers/utils')
const { msgConstant, responseStatus, profileRankConstant, profileConstant, userType } = require('../helpers/appConstants')
const userSchema = require('../models/user.schema')
const adminSchema = require('../models/admin.schema')


//user authentication
module.exports.userAuthentication = async (req, res, next) => {
    try {

        const authToken = req.headers['authorization']

        if (!authToken || !authToken.startsWith('Bearer ')) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        let decodedToken = await utils.verifyJwt(authToken.replace('Bearer ', ''))

        if (!decodedToken) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        const { _id, password, deviceToken } = decodedToken

        const userDetails = await userSchema.findOne({ _id: _id, password, deviceToken }).lean()
        if (!userDetails) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        req.user = userDetails
        next()

    } catch (error) {
        return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, error))
    }
}

//admin authentication
module.exports.adminAuthentication = async (req, res, next) => {
    try {

        const authToken = req.headers['authorization']

        if (!authToken || !authToken.startsWith('Bearer ')) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        let decodedToken = await utils.verifyJwt(authToken.replace('Bearer ', ''))

        if (!decodedToken) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        const { _id, password, deviceToken } = decodedToken
        const adminDetail = await adminSchema.findOne({ _id: _id, password, deviceToken }, { _id: 1, password: 1 }).lean()

        if (!adminDetail) return res.status(responseStatus.unAuthorized).json(utils.createErrorResponse(req, msgConstant.sessionExpired))

        req.admin = adminDetail
        next()


    } catch (error) {
        return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, error))
    }
}
