const { userType, } = require("../../../helpers/appConstants");
const { parseToMongoObjectID } = require("../../../helpers/utils");
const moment = require('moment');
const userSchema = require("../../../models/user.schema");



module.exports.getUserList = (offset, limit, search, sort, order) => {
    const aggregationArray = [

        {
            $match: {
                emailVerified: true,
                ...(search && {
                    $or: [
                        { "userName": { $regex: new RegExp(('.*' + search + '.*'), "i") } },
                        { "email": { $regex: new RegExp(('.*' + search + '.*'), "i") } }
                    ]
                }),
            }
        },
        {
            $sort: { [sort]: order }
        },
        {
            $project: {
                userName: 1,
                email: 1,
                dob: 1,
                name: 1,
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
    return userSchema.aggregate(aggregationArray);
}

module.exports.getUserDetail = (userId) => {
    const aggregationArray = [
        {
            $match: {
                _id: parseToMongoObjectID(userId)
            }
        },
        {
            $project: {
                userName: 1,
                email: 1,
                dob: 1,
                name: 1,
            }
        },
    ]
    return userSchema.aggregate(aggregationArray);
}