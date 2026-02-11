const yup = require("yup");
const { userType, deviceType, requestType, orderStatus } = require("../helpers/appConstants");



module.exports.signUp = yup.object({
    body: yup.object({
        deviceType: yup.string().oneOf(Object.values(deviceType)).required(),
        email: yup.string().trim().email().required(),
        deviceToken: yup.string().trim().required(),
        password: yup.string().trim().required(),
    })
})

module.exports.verifyOtp = yup.object({
    body: yup.object({
        deviceType: yup.string().oneOf(Object.values(deviceType)).required(),
        email: yup.string().trim().email().required(),
        otp: yup.string().required(),
        reqType: yup.string().oneOf(Object.values(requestType)).required()
    })
})


module.exports.login = yup.object({
    body: yup.object({
        password: yup.string().required(),
        deviceType: yup.string().oneOf(Object.values(deviceType)).required(),
        email: yup.string().trim().email().required(),
        deviceToken: yup.string().required()
    })
})


module.exports.changePassword = yup.object({
    body: yup.object({
        oldPassword: yup.string().required(),
        password: yup.string().required()
    })
})


module.exports.updateProProfile = yup.object({
    body: yup.object({
        name: yup.string().required(),
        dob: yup.date().required(),
        email: yup.string().required(),
    })
})

module.exports.createOrder = yup.object({
    body: yup.object({
        productId: yup.string().matches(/^[0-9a-zA-Z]{24}$/, 'Please enter valid ObjectId.').required(),
    })
})

module.exports.cancelOrder = yup.object({
    body: yup.object({
        orderId: yup.string().matches(/^[0-9a-zA-Z]{24}$/, 'Please enter valid ObjectId.').required(),
    })
})

module.exports.paymentOrder = yup.object({
    body: yup.object({
        orderId: yup.string().matches(/^[0-9a-zA-Z]{24}$/, 'Please enter valid ObjectId.').required(),
        amount: yup.number().required(),
    })
})

module.exports.orderList = yup.object({
    body: yup.object({
        filter: yup.string().oneOf(Object.values(orderStatus)).optional().nullable(),
    })
})
