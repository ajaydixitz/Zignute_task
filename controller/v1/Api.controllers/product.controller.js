const utils = require('../../../helpers/utils');
const { responseStatus, msgConstant, userType, orderStatus } = require("../../../helpers/appConstants");
const productAggregation = require('../aggregation.controllers/product.aggregation');
const productSchema = require("../../../models/product.schema");
const orderSchema = require('../../../models/order.schema')
const redis = require('../../../helpers/redis');
const CACHE_TTL_SECONDS = 60;


// Product

module.exports.addProduct = async (req, res) => {

    const { name, price, description, totalStock } = req.body;
    console.log(req.file)

    const checkStock = await productSchema.findOne({ name: { $regex: name, $options: 'i' } })
    if (checkStock) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.sameProductName))

    if (!req?.file) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.selectImage))

    await productSchema({ name, price, description, totalStock, currentStock: totalStock, image: req.file.path }).save()
    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.createProduct))
}

module.exports.updateProduct = async (req, res) => {

    const { productId, name, price, description, totalStock, } = req.body;

    const checkStock = await productSchema.findOne({ _id: { $ne: productId }, name: { $regex: name, $options: 'i' } })
    if (checkStock) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.sameProductName))

    await productSchema.updateOne({ _id: productId }, {
        name, price, description, totalStock, currentStock: totalStock, currentStock: totalStock,
        ...(req?.file?.path ? { image: req.file.path } : {})
    })

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.updateProduct))
}

module.exports.productList = async (req, res) => {

    const { offset = 0, limit = 10, search, sort = "createdAt", order = -1, } = req.body;

    let list = await productAggregation.productList(offset, limit, utils.escapeSpecialCharacter(search), sort, order);
    let totalCount = list && list[0] && list[0].totalCount ? list[0].totalCount.count : 0
    const pagination = utils.paginationData(totalCount, limit, offset)
    list = list[0].data ?? []

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.userListFetchSuccess, { list, pagination }))
}

//Order

module.exports.createOrder = async (req, res) => {

    const { productId } = req.body;

    const checkStock = await productSchema.findOne({ _id: productId })
    if (!checkStock || checkStock?.currentStock == 0) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidProduct))

    await orderSchema({ productId, userId: req.user._id, amount: checkStock?.price }).save()
    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.createOrder))
}

module.exports.cancelOrder = async (req, res) => {

    const { orderId } = req.body;

    const checkOrder = await orderSchema.findOne({ _id: orderId, userId: req.user._id, status: { $ne: orderStatus?.cancelled } })
    if (!checkOrder) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidOrder))

    await Promise.all([
        orderSchema.findOneAndUpdate({ _id: orderId }, { status: orderStatus?.cancelled }),
        ...(checkOrder?.status == orderStatus.confirmed
            ? [productSchema.findOneAndUpdate({ _id: checkOrder?.productId }, { $inc: { currentStock: 1 } })] : [])
    ])
    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.cancelOrder))
}

module.exports.paymentForOrder = async (req, res) => {

    const { orderId, amount } = req.body;

    const checkOrder = await orderSchema.findOne({ _id: orderId, status: orderStatus?.created })
    if (!checkOrder || checkOrder?.amount != amount) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, checkOrder ? 'Invalid amount.' : msgConstant.invalidOrder))

    const checkStock = await productSchema.findOne({ _id: checkOrder?.productId })
    if (!checkStock || checkStock?.currentStock == 0) return res.status(responseStatus.badRequest).json(utils.createErrorResponse(req, msgConstant.invalidProduct))

    await Promise.all([
        orderSchema.findOneAndUpdate({ _id: orderId }, { status: orderStatus?.confirmed }),
        productSchema.findOneAndUpdate({ _id: checkOrder?.productId }, { $inc: { currentStock: -1 } })
    ])

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.paySuccess))
}

module.exports.orderList = async (req, res) => {

    const { offset = 0, limit = 10, search, sort = "createdAt", order = -1, filter } = req.body;

    let list = await productAggregation.orderList(offset, limit, utils.escapeSpecialCharacter(search), sort, order, filter, req?.user?._id || null);
    let totalCount = list && list[0] && list[0].totalCount ? list[0].totalCount.count : 0
    const pagination = utils.paginationData(totalCount, limit, offset)
    list = list[0].data ?? []

    return res.status(responseStatus.success).json(utils.createSuccessResponse(req, msgConstant.userListFetchSuccess, { list, pagination }))
}