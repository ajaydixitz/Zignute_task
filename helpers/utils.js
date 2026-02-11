const bcrypt = require("bcryptjs");
const SALT = process.env.SALT;
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRETKEY;
const fs = require("fs");
const { responseStatus } = require("../helpers/appConstants");
const { default: mongoose } = require("mongoose");
const moment = require("moment");
const { responseEncryptor } = require("./decryptor");
const { activityLogger, errorLogger } = require("./logger");

module.exports.createErrorResponse = (req, message, success = false) => {
  errorLogger.error({
    message,
    userId: req?.user?._id || null,
    ip: req?.ip,
    route: req?.originalUrl,
  });
  return responseEncryptor({ req, success, message });
};

module.exports.createSuccessResponse = (
  req,
  message,
  data = null,
  success = true,
) => {
  activityLogger.info({
    message,
    userId: req?.user?._id || null,
    ip: req?.ip,
    route: req?.originalUrl,
  });
  return responseEncryptor({ req, success, message, data });
};

module.exports.decodedPayload = (signedPayload) =>
  JWT.decode(signedPayload, { complete: true });

module.exports.generateToken = (payload, options) =>
  JWT.sign(payload, JWT_SECRET, options);

module.exports.hashPassword = (password) =>
  bcrypt.hash(password, parseInt(SALT));

module.exports.comparePassword = (hash, password) =>
  bcrypt.compare(password, hash);

module.exports.escapeSpecialCharacter = (text) => {
  if (text) return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  else return null;
};

module.exports.verifyJwt = async (token) => {
  try {
    const data = JWT.verify(token, process.env.SECRETKEY);
    return data;
  } catch (error) {
    return false;
  }
};
module.exports.parseToMongoObjectID = (string) =>
  new mongoose.Types.ObjectId(string);

module.exports.createStaticFolders = async () => {
  if (!fs.existsSync("public")) fs.mkdirSync("public");
  if (!fs.existsSync("public/user")) fs.mkdirSync("public/user");
  if (!fs.existsSync("public/product")) fs.mkdirSync("public/product");
};

module.exports.paginationData = (totalCount, LIMIT, OFFSET) => {
  let totalPages = Math.ceil(totalCount / LIMIT);
  let currentPage = Math.floor(OFFSET / LIMIT);
  let prevPage = currentPage - 1 > 0 ? (currentPage - 1) * LIMIT : 0;
  let nextPage = currentPage + 1 <= totalPages ? (currentPage + 1) * LIMIT : 0;

  return {
    totalCount,
    nextPage,
    prevPage,
    totalCount,
    currentPage: currentPage + 1,
  };
};

module.exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports.generateAlphanumericString = () => "123456";
