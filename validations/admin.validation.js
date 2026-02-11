const yup = require("yup");
const { userType, orderStatus } = require("../helpers/appConstants");


module.exports.login = yup.object({
    body: yup.object({
        password: yup.string().required(),
        email: yup.string().trim().email().required()
    })
})

module.exports.changePassword = yup.object({
    body: yup.object({
        oldPassword: yup.string().required(),
        password: yup.string().required()
    })
})


module.exports.getUserDetails = yup.object({
    body: yup.object({
        userId: yup.string().matches(/^[0-9a-zA-Z]{24}$/, 'Please enter valid ObjectId.').required(),
    })
})


module.exports.addProduct = yup.object({
    body: yup.object({
        name: yup.string().required(),
        description: yup.string().required(),
        price: yup.number().required(),
        totalStock: yup.number().required(),
    })
})

module.exports.updateProduct = yup.object({
    body: yup.object({
        productId: yup.string().matches(/^[0-9a-zA-Z]{24}$/, 'Please enter valid ObjectId.').required(),
        name: yup.string().required(),
        description: yup.string().required(),
        price: yup.number().required(),
        totalStock: yup.number().required(),
    })
})

module.exports.orderList = yup.object({
    body: yup.object({
        filter: yup.string().oneOf(Object.values(orderStatus)).optional().nullable(),
    })
})