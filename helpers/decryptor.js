const { cryptoManager } = require("../helpers/crypto");
const utils = require('./utils')


const cryptoInstance = new cryptoManager();

const requestDecryptor = (req, res, next, isFormData = false, onlyFiles = false) => {


    if (JSON.parse(process.env.ENCRYPTIONALLOWED) && req?.body?.payload) req.body = cryptoInstance.decryption(req?.body?.payload);
    else if (JSON.parse(process.env.ENCRYPTIONALLOWED) && !req?.body?.payload && isFormData && !onlyFiles) return res.status(400).json(utils.createErrorResponse(req, 'Invalid Payload'))

    next();
};

const responseEncryptor = ({ req, success, message, data }) => {
    if (JSON.parse(process.env.ENCRYPTIONALLOWED)) return cryptoInstance.encryption({ success, message, data });
    else return { success, message, data };

};

module.exports = { requestDecryptor, responseEncryptor };