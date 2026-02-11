const userSchema = require("../../../models/user.schema");

const utils = require("../../../helpers/utils");
const {
  msgConstant,
  responseStatus,
  requestType,
  userType,
} = require("../../../helpers/appConstants");
const moment = require("moment");

// Sign-un
module.exports.signup = async (req, res) => {
  const { email, deviceType, deviceToken, password } = req.body;

  let user = await userSchema.findOne({ email }).select("_id email").lean();
  if (user)
    return res
      .status(responseStatus.badRequest)
      .json(utils.createErrorResponse(req, msgConstant.emailAlreadExist));

  user = await userSchema({
    email,
    deviceType,
    emailVerified: true,
    deviceToken,
    password: await utils.hashPassword(password),
  }).save();
  return res
    .status(responseStatus.success)
    .json(utils.createSuccessResponse(req, msgConstant.userRegistered));
};

//login
module.exports.login = async (req, res) => {
  const { email, password, deviceToken, deviceType, fcmToken } = req.body;

  const verify = await userSchema.findOne({ email }).lean();
  if (!verify)
    return res
      .status(responseStatus.badRequest)
      .send(
        utils.createErrorResponse(req, msgConstant.invalidEmailAndPassword),
      );

  if (!(await utils.comparePassword(verify?.password, password)))
    res
      .status(responseStatus.badRequest)
      .send(
        utils.createErrorResponse(req, msgConstant.invalidEmailAndPassword),
      );

  const [user] = await Promise.all([
    userSchema.findOneAndUpdate(
      { _id: verify._id },
      { deviceToken, deviceType },
      { new: true },
    ),
  ]);

  return res.status(responseStatus.success).send(
    utils.createSuccessResponse(req, msgConstant.loggedIn, {
      token: utils.generateToken({
        _id: user._id,
        password: user.password,
        deviceToken,
        deviceType,
      }),
    }),
  );
};

//Edit profile
module.exports.updateProfile = async (req, res) => {
  const { name, dob, email } = req.body;

  const checkEmail = await userSchema
    .findOne({ _id: { $ne: req.user._id }, email }, { name: 1, dob: 1 })
    .lean();
  if (checkEmail)
    return res
      .status(responseStatus.badRequest)
      .json(utils.createErrorResponse(req, msgConstant.emailAlreadExist));

  userSchema
    .updateOne(
      { _id: req.user._id },
      { name, dob, email, image: req?.file?.path },
    )
    .then()
    .catch();
  return res
    .status(responseStatus.success)
    .json(utils.createSuccessResponse(req, msgConstant.profileUpdate));
};

// Change password
module.exports.changePassword = async (req, res) => {
  const { oldPassword, password } = req.body;

  const getUser = await userSchema
    .findOne({ _id: req.user._id }, { password: 1 })
    .lean();

  if (await utils.comparePassword(getUser.password, oldPassword)) {
    const hash = await utils.hashPassword(password);
    await userSchema.updateOne({ _id: getUser._id }, { password: hash });
    return res.status(responseStatus.success).json(
      utils.createSuccessResponse(req, msgConstant.passwordChanged, {
        token: utils.generateToken({ _id: req.user._id, password: hash }),
      }),
    );
  } else
    return res
      .status(responseStatus.badRequest)
      .json(utils.createErrorResponse(req, msgConstant.incorrectOldPassword));
};

//logout
module.exports.logout = async (req, res) => {
  await userSchema.updateOne({ _id: req.user._id }, { deviceToken: null });
  return res
    .status(responseStatus.success)
    .json(utils.createSuccessResponse(req, msgConstant.loggedout));
};

module.exports.getProfile = async (req, res) => {
  const user = await userSchema
    .findOne({ _id: req.user._id }, { name: 1, email: 1, dob: 1, image: 1 })
    .lean();
  return res
    .status(responseStatus.success)
    .json(utils.createSuccessResponse(req, msgConstant.userDetails, user));
};

module.exports.purchaseSubscription = async (req, res) => {
  await userSchema.updateOne({ _id: req.user._id }, { isPaid: true });
  return res
    .status(responseStatus.success)
    .json(utils.createSuccessResponse(req, msgConstant.subscriptionPurchased));
};
