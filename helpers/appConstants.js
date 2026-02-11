const { admin } = require("googleapis/build/src/apis/admin");

module.exports.msgConstant = {
  //ADMINN
  appName: "MWB",
  admin: "admin",
  dataFetchSuccess: "Data fetch successfully.",
  userListFetchSuccess: "User list fetch successfully.",
  activityFetched: "Activity fetched successfully.",
  emailAlreadyExist: "Email address already exist.",
  adminCreatedSuccess: "Sub admin has been created successfully.",
  unAuthorizedError: "You not authorized to perform this action.",
  invalidId: "Invalid id",
  adminNot: "Admin not found.",
  samePassword: "New password can not be same as old password.",
  incorrectOldPassword: "Please enter valid old password.",

  //APPLICATION
  emailAlreadExist: "That email is taken. Try another.",
  appVersion: "App version fetched.",
  userRegistered: "User registered successfully. Please proceed to login.",
  resendOtp: "OTP resent successfully.",
  passwordValidation:
    "Password must include 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric value, 1 special character and no spaces.",
  otpVerified: "OTP verified successfully.",
  profileCreated: "Your profile has been created successfully.",
  invalidOtp: "Please enter valid OTP.",
  userNameErr: "That username is taken. Try another.",
  notRegisteed: "Verify your email first.",
  userNot: "User not found.",
  enterValidEmail: "Please enter valid email.",
  loggedIn: "Logged in successfully.",
  invalidEmailAndPassword: "Please enter valid email or password.",
  signUpFirst: "Please sign up your account first.",
  sessionExpired: "Your session has been expired.",
  unAuthorized: "You are unauthorized to perform this action..",
  loggedout: "Logged out successfully.",
  passSkip: "Change password skipped.",
  blockedList: "Blocked list has been fetched successfully.",
  screenCompleted: "Welcome screen completed.",
  userNameAlreadExist: "Username already exist.",
  emailNotRegistered: "This email is not registered with us.",
  forgotPasswordLinkSent: "OTP has been sent to registered email.",
  forgotPasswordLinkSenttoAdmin:
    "Reset password link has been sent to registered email.",
  resetPassword: "Reset Password",
  verifyOTP: "Verify OTP",
  otpExpired: "OTP has been expired.",
  passwordChanged: "Password changed successfully.",
  invalidFileUpload: "The file uploading is invalid.",
  profileUpdate: "Profile has been updated successfully.",
  fileRequired: "Please select file.",
  selectImage: "Please select image.",
  selectIcon: "Please select icon.",
  userDetails: "User details has beem fetched successfully.",
  superUser: "User updated successfully.",
  unAuthorizer: "You are not authorize for this operation.",
  deactivateByAdmin: "Admin has deactivate your account.",
  deleteAccountForAdmin: "Account has been deleted successfully.",

  //PRODUCT
  sameProductName:
    "Product name already exists. Please choose a different name.",
  createProduct: "Product has been created successfully.",
  updateProduct: "Product has been updated successfully.",
  invalidProduct: "Invalid product.",

  //Order
  createOrder:
    "Order has been created successfully, please proceed for payment.",
  invalidOrder: "invalid order.",
  cancelOrder: "Order has been cancelled successfully.",
  paySuccess: "Payment has been received successfully.",

  //Subscription
  subscriptionPurchased: "Subscription has been purchased successfully.",
  //General
  tooManyRequests: "Too many requests, please try again later.",
  blockedIp:
    "Your IP has been temporarily blocked due to multiple failed attempts. Please try again later.",
  accessDenied:
    "Access denied. Your IP is not allowed to access this resource.",
};

module.exports.responseStatus = {
  success: 200,
  created: 201,
  noContent: 204,
  unAuthorized: 401,
  forbidden: 403,
  badRequest: 400,
  conflict: 409,
  internalServerError: 500,
  badGateway: 502,
  notFound: 404,
  tooManyRequests: 429,
};

module.exports.deviceType = { ios: "ios", android: "android", web: "web" };

module.exports.requestType = { verify: "verify", forgot: "forgot" };

module.exports.userType = {
  admin: "admin",
  user: "user",
};

module.exports.orderStatus = {
  created: "created",
  confirmed: "confirmed",
  cancelled: "cancelled",
  shipped: "shipped",
  delivered: "delivered",
};

module.exports.ipLimiterConfig = {
  maxViolations: 5,
  blockDuration: 300, // 5 minutes
};

module.exports.checkIpList = {
  whiteListIps: ["127.0.0.1", "192.168.1.10"],
  blackListIps: ["127.0.0.5", "192.168.1.12"],
  adminIpsList: ["127.0.0.4", "192.168.1.13"],
};
