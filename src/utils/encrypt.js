const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

const encrypt = (string) => {
    const encryptedString = cryptr.encrypt(string);
    return encryptedString;
}

const decrypt = (encryptedString) => {
    const decryptedString = cryptr.decrypt(encryptedString);
    return decryptedString;

}


module.exports = {
    encrypt,
    decrypt
}