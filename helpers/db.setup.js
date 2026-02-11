const userSchema = require('../models/user.schema')
const adminSchema = require('../models/admin.schema')


const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD
const utils = require('./utils')
const { userType } = require('../helpers/appConstants')

module.exports.dbInitializer = async () => {
    try {
        const admin = await adminSchema.findOne({ email: adminEmail })
        if (!admin) {
            const deviceToken = Date.now()
            await adminSchema({ email: adminEmail, password: await utils.hashPassword(adminPassword) }).save()
            console.log("::::::::::::::======ADMIN CREATED SUCCESS======::::::::::::::")
        }

    } catch (ERROR) {
        console.log("Static data creation error, server stopped.", ERROR)
        process.exit()
    }
}
