const express = require('express')
const router = express.Router()
const userRoutes = require('./user.route')
const adminRoutes = require('./admin.route')


router.use('/user', userRoutes)
router.use('/admin', adminRoutes)

module.exports = router