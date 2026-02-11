const utils = require('../../../helpers/utils');
const { responseStatus, msgConstant, userType, } = require("../../../helpers/appConstants");
const adminAggregation = require('../aggregation.controllers/admin.aggregation');
const userSchema = require("../../../models/user.schema");
const adminSchema = require('../../../models/admin.schema')



// Login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminSchema.findOne({ email }).select('_id password').lean()
    if (!admin || !await utils.comparePassword(admin?.password, password)) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidEmailAndPassword))

    const deviceToken = Date.now()
    await adminSchema.updateOne({ _id: admin._id }, { deviceToken: Date.now() })

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.loggedIn, { token: utils.generateToken({ _id: admin._id, password: admin.password, deviceToken }) }))
}

// Change password
module.exports.changePassword = async (req, res) => {


    const admin = req.admin
    const { oldPassword, password } = req.body

    if (await utils.comparePassword(admin.password, oldPassword)) {
        if (!await utils.comparePassword(admin.password, password)) {

            const getAdmin = await adminSchema.findOneAndUpdate({ _id: admin._id }, { password: await utils.hashPassword(password) }, { new: true })

            return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.passwordChanged, {
                token: utils.generateToken({ _id: getAdmin._id, password: getAdmin.password, deviceToken: getAdmin?.deviceToken })
            }))
        }
        else return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.samePassword))
    }
    else return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.incorrectOldPassword))

}

// Logout
module.exports.logout = async (req, res) => {

    await adminSchema.updateOne({ _id: req.admin._id }, { deviceToken: null })
    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.loggedout))
}

// user list
module.exports.userList = async (req, res) => {

    const { offset = 0, limit = 10, search, sort = "createdAt", order = -1, } = req.body;

    let userList = await adminAggregation.getUserList(offset, limit, utils.escapeSpecialCharacter(search), sort, order);
    let totalCount = userList && userList[0] && userList[0].totalCount ? userList[0].totalCount.count : 0
    const pagination = utils.paginationData(totalCount, limit, offset)
    userList = userList[0].data ?? []

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.userListFetchSuccess, { userList, pagination }))
}

//user detail
module.exports.userDetail = async (req, res) => {

    const { userId } = req.body;
    let data = await adminAggregation.getUserDetail(userId);
    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.accountStatus, data[0]))
}



