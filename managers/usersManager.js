const knex = require('../knex');
const { md5 } = require('./securityManager');

const TABLE_NAME = 'users';
module.exports = {
  async addUser(name, password) {
    const [userId] = await knex(TABLE_NAME).insert({ name, password: md5(password) });
    return userId;
  },
  async findOne(name, password) {
    const [user] = await knex(TABLE_NAME).select()
      .where('name', name)
      .where('password', md5(password));
    return user;
  },
};
