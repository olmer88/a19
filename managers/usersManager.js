const knex = require('../knex');
const crypto = require('crypto');
const TABLE_NAME = 'users';

const md5 = (password) => crypto
    .createHash('md5')
    .update(password)
    .digest('base64');

module.exports = {

  async getAllUsers(){
      return knex(TABLE_NAME).select();
  },

  async addUser(userName, password) {
      const hashedPassword = md5(password);
      return knex(TABLE_NAME).insert({userName, password: hashedPassword});
  },

  async loginIn(userName, password) {
      const hashedPassword = md5(password);
      return knex(TABLE_NAME).select().where({ userName, password: hashedPassword });
  },

  async deleteUser(userId) {
      return knex(TABLE_NAME).where('userId', userId).del();
  }

};