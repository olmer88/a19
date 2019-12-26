const knex = require('../knex');
const TABLE_NAME = 'users';
module.exports = {
  async getAllUsers() {
      return knex(TABLE_NAME).select();
  },
  async addUser(userName, password) {
      return knex(TABLE_NAME).insert({userName : userName, password: password});
  },
  async loginIn(userName, password) {
      return knex(TABLE_NAME).select().where({userName : userName, password : password});
  }
};