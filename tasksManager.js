const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'a19',
  }
});
const TABLE_NAME = 'tasks';

module.exports = {
  async addTask(description) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date() });
  },
  async getAllTasks() {
    return knex(TABLE_NAME).select();
  },
};
