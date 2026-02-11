const express = require("express");
const router = express.Router();
const { asyncTryCatchMiddleware } = require("../../middlewares/ayncHandler");
const { validator } = require("../../middlewares/validation");
const { adminAuthentication } = require("../../middlewares/authentication");
const adminValiadtion = require("../../validations/admin.validation");
const adminController = require("../../controller/v1/Api.controllers/admin.controller");
const productController = require("../../controller/v1/Api.controllers/product.controller");
const { multerForProduct } = require("../../middlewares/multer");
const {
  dynamicUserLimiter,
  loginLimiter,
} = require("../../helpers/setLimitter");

//auth
router.post(
  "/sign-in",
  loginLimiter,
  validator(adminValiadtion.login),
  asyncTryCatchMiddleware(adminController.login),
);

router.post(
  "/change-password",
  adminAuthentication,
  dynamicUserLimiter,
  validator(adminValiadtion.changePassword),
  asyncTryCatchMiddleware(adminController.changePassword),
);

router.get(
  "/logout",
  adminAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(adminController.logout),
);

router.post(
  "/user-list",
  adminAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(adminController.userList),
);

router.post(
  "/user-details",
  adminAuthentication,
  dynamicUserLimiter,
  validator(adminValiadtion.getUserDetails),
  asyncTryCatchMiddleware(adminController.userDetail),
);

router.post(
  "/create-product",
  adminAuthentication,
  dynamicUserLimiter,
  multerForProduct,
  validator(adminValiadtion.addProduct),
  asyncTryCatchMiddleware(productController.addProduct),
);

router.post(
  "/product-list",
  adminAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(productController.productList),
);

module.exports = router;
