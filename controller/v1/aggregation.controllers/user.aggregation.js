const { parseToMongoObjectID } = require("../../../helpers/utils")

const userSchema = require("../../../models/user.schema")
const { } = require("../../../helpers/appConstants")


// HOME
module.exports.getUserDetail = (userId, selfId) => {
    const aggregationArray = [
        {
            $match: {
                _id: parseToMongoObjectID(userId)
            }
        },
        {
            $lookup: {
                from: 'blockusers',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ['$blockedUser', ['$$userId', parseToMongoObjectID(selfId)]] },
                                    { $in: ['$blockedBy', ['$$userId', parseToMongoObjectID(selfId)]] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    }
                ], as: 'blockedUser'
            },
        },
        {
            $match: {
                $expr: {
                    $eq: [{ $size: '$blockedUser' }, 0]
                }
            }
        },
        {
            $lookup: {
                from: 'reportposts',
                pipeline: [
                    {
                        $match: {
                            reportBy: selfId
                        }
                    },
                    {
                        $project: {
                            post: 1
                        }
                    }
                ], as: 'reportedPost'
            }
        },
        {
            $lookup: {
                from: 'hideposts',
                pipeline: [
                    {
                        $match: {
                            hideBy: selfId
                        }
                    },
                    {
                        $project: {
                            post: 1
                        }
                    }
                ], as: 'hiddenPost'
            }
        },
        {
            $lookup: {
                from: 'posts',
                let: { userId: '$_id', hiddenPostArray: '$hiddenPost.post', reportedPostArray: '$reportedPost.post' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$createdBy', '$$userId'] },
                                    { $not: { $in: ['$_id', "$$reportedPostArray"] } },
                                    { $not: { $in: ['$_id', "$$hiddenPostArray"] } }
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            let: { postId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ['$post', '$$postId']
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        typeOfComment: 1,
                                        comment: 1
                                    }
                                }
                            ], as: 'postComments'
                        }
                    },
                    {
                        $project: {
                            text: 1,
                            file: 1,
                            createdBy: 1,
                            postType: 1,
                            comment: {
                                $size: {
                                    $filter:
                                    {
                                        input: '$postComments',
                                        as: 'comments',
                                        cond: { $eq: ['$$comments.typeOfComment', typeOfComment.comment] },
                                    }
                                }
                            },
                            redHeart: {
                                $size: {
                                    $filter: {
                                        input: "$postComments",
                                        as: "postReaction",
                                        cond: { $eq: ["$$postReaction.comment", reactionEmoji.redHeart] },
                                    }
                                }
                            },
                            smileyHeart: {
                                $size: {
                                    $filter: {
                                        input: "$postComments",
                                        as: "postReaction",
                                        cond: { $eq: ["$$postReaction.comment", reactionEmoji.smileyHeart] },
                                    }
                                }
                            },
                            smileyFace: {
                                $size: {
                                    $filter: {
                                        input: "$postComments",
                                        as: "postReaction",
                                        cond: { $eq: ["$$postReaction.comment", reactionEmoji.smileyFace] },
                                    }
                                }
                            },
                            happyFace: {
                                $size: {
                                    $filter: {
                                        input: "$postComments",
                                        as: "postReaction",
                                        cond: { $eq: ["$$postReaction.comment", reactionEmoji.happyFace] },
                                    }
                                }
                            },
                            partyFace: {
                                $size: {
                                    $filter: {
                                        input: "$postComments",
                                        as: "postReaction",
                                        cond: { $eq: ["$$postReaction.comment", reactionEmoji.partyFace] },
                                    }
                                }
                            }, createdAt: 1
                        }
                    }
                ], as: 'userPost'
            }
        },
        {
            $lookup: {
                from: 'followings',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$followingUser', "$$userId"]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            followedBy: 1
                        }
                    }
                ], as: 'followers'
            }
        },
        {
            $lookup: {
                from: 'followings',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$followedBy', "$$userId"]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1
                        }
                    }
                ], as: 'followings'
            }
        },
        {
            $lookup: {
                from: 'pros',
                localField: "_id",
                foreignField: "user",
                as: 'pro',
                pipeline: [
                    {
                        $project: {
                            status: 1,
                            createdAt: 1,
                            image: 1,
                            reason: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$pro",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                avatar: 1,
                fullName: 1,
                streak: 1,
                coin: 1,
                isPrivate: 1,
                firstName: 1,
                lastName: 1,
                userPost: 1,
                typeOfUser: 1,
                followings: { $size: '$followings' },
                followers: { $size: '$followers' },
                isFollowing: {
                    $cond: {
                        if: { $in: [parseToMongoObjectID(selfId), '$followers.followedBy'] },
                        then: true,
                        else: false
                    }
                },
                isProUser: { $cond: ["$pro.image", true, false] },
                proStatus: { $cond: ["$pro.status", "$pro.status", proStatus.notApplied] },
                pro: 1,
                onboardingCompleted: 1,
            }
        }
    ]
    return userSchema.aggregate(aggregationArray)
}



module.exports.getUserData = (selfId) => {
    const aggregationArray = [
        {
            $match: {
                _id: parseToMongoObjectID(selfId)
            }
        },
        {
            $lookup: {
                from: "notifications",
                localField: "_id",
                foreignField: "notifiedUser",
                as: "totalNotification",
                pipeline: [
                    {
                        $match: {
                            seen: false
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "_id",
                foreignField: "to",
                as: "unseenMessage",
                pipeline: [
                    {
                        $match: {
                            seen: false
                        }
                    }
                ]
            }
        },
        {
            $project: {
                badgeCount: { $sum: [{ $size: "$unseenMessage" }, { $size: "$totalNotification" }] }
            }
        }
    ]
    return userSchema.aggregate(aggregationArray)
}