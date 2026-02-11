const CryptoJS = require("crypto-js");

const passphrase = CryptoJS.enc.Utf8.parse(process.env.CRYPTOSECRET);
const payload = {
    mode: CryptoJS.mode.CBC,
    iv: passphrase,
    padding: CryptoJS.pad.Pkcs7,
};

class cryptoManager {
    encryption(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), passphrase, payload).toString();
    }

    decryption(ciphertext) {
        try {
            return JSON.parse(CryptoJS.AES.decrypt(ciphertext, passphrase, payload).toString(CryptoJS.enc.Utf8));
        } catch (err) {
            return {};
        }
    }
}
module.exports = { cryptoManager };