const knex = require('../knex');
const { md5 } = require('./../utils/md5');
const TABLE_NAME = 'users';


module.exports = {
  async findOne(userName){
      return knex(TABLE_NAME).select().where({ userName });
  },

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