const { md5 } = require('./md5');

const publicKey = "myPublicKey";
const HashDuplicateName = md5("duplicate name" + publicKey);

const makePrivateKeyKey = (message) => {
    return md5(message + publicKey);
};

const isValidMessage = (message) => {
    return md5(message+publicKey) === HashDuplicateName;
};

module.exports = {publicKey, makePrivateKeyKey, isValidMessage };