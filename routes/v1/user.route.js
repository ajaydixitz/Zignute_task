const express = require("express");
const router = express.Router();
const userController = require("../../controller/v1/Api.controllers/user.controller");
const { asyncTryCatchMiddleware } = require("../../middlewares/ayncHandler");
const { validator } = require("../../middlewares/validation");
const userValidation = require("../../validations/user.validation");
const {
  userAuthentication,
  apiKeyAuthentication,
} = require("../../middlewares/authentication");
const { multerForUser } = require("../../middlewares/multer");
const productController = require("../../controller/v1/Api.controllers/product.controller");
const {
  dynamicUserLimiter,
  loginLimiter,
} = require("../../helpers/setLimitter");

//auth
router.post(
  "/signup",
  loginLimiter,
  validator(userValidation.signUp),
  asyncTryCatchMiddleware(userController.signup),
);

router.post(
  "/login",
  loginLimiter,
  validator(userValidation.login),
  asyncTryCatchMiddleware(userController.login),
);

router.post(
  "/update-profile",
  userAuthentication,
  dynamicUserLimiter,
  multerForUser,
  validator(userValidation.updateProProfile),
  asyncTryCatchMiddleware(userController.updateProfile),
);

router.post(
  "/change-password",
  userAuthentication,
  dynamicUserLimiter,
  validator(userValidation.changePassword),
  asyncTryCatchMiddleware(userController.changePassword),
);

router.get(
  "/logout",
  userAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(userController.logout),
);

router.get(
  "/get-profile",
  userAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(userController.getProfile),
);

//product
router.post(
  "/product-list",
  userAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(productController.productList),
);

router.get(
  "/purchase-subscription",
  userAuthentication,
  dynamicUserLimiter,
  asyncTryCatchMiddleware(userController.purchaseSubscription),
);

module.exports = router;
