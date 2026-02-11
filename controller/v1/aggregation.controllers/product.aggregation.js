const { userType, } = require("../../../helpers/appConstants");
const { parseToMongoObjectID } = require("../../../helpers/utils");
const moment = require('moment');
const productSchema = require("../../../models/product.schema");
const orderSchema = require('../../../models/order.schema')



module.exports.productList = (offset, limit, search, sort, order) => {
    const aggregationArray = [

        {
            $match: {
                _id: { $ne: null },
                ...(search && {
                    $or: [
                        { "name": { $regex: new RegExp(('.*' + search + '.*'), "i") } },
                    ]
                }),
            }
        },
        {
            $sort: { [sort]: order }
        },
        {
            $project: {
                name: 1,
                price: 1,
                description: 1,
                currentStock: 1,
                image: 1,
            }
        },
        {
            $facet: {
                data: [{ $skip: offset }, ...(limit === -1 ? [] : [{ $limit: limit }])],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$totalCount",
                preserveNullAndEmptyArrays: true
            }
        }

    ]
    return productSchema.aggregate(aggregationArray);
}


module.exports.orderList = (offset, limit, search, sort, order, filter, userId) => {
    const aggregationArray = [

        {
            $match: {
                _id: { $ne: null },
                ...(userId ? { userId: parseToMongoObjectID(userId) } : {}),
                ...(filter && {
                    $or: [
                        { "status": { $regex: new RegExp(('.*' + filter + '.*'), "i") } },
                    ]
                }),
            }
        },
        {
            $sort: { [sort]: order }
        },
        ...(!userId ? [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                image: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$userData"
                }
            }
        ] : []),

        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productData",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            price: 1,
                            image: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$productData"
            }
        },
        {
            $project: {
                oderId: "$_id",
                amount: 1,
                status: 1,
                userData: 1,
                productData: 1
            }
        },
        {
            $facet: {
                data: [{ $skip: offset }, ...(limit === -1 ? [] : [{ $limit: limit }])],
                totalCount: [
                    {
                        $count: 'count'
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$totalCount",
                preserveNullAndEmptyArrays: true
            }
        }

    ]
    return orderSchema.aggregate(aggregationArray);
}