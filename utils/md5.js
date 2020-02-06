const crypto = require('crypto');

const md5 = (password) => crypto
    .createHash('md5')
    .update(password)
    .digest('base64');

module.exports = { md5 };