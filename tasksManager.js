const knex = require('./knex');
const TABLE_NAME = 'tasks';

module.exports = {
  async addTask(description) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date() });
  },
  async getAllTasks() {
    return knex(TABLE_NAME).select();
  },
  async deleteOne(taskId) {
    return knex(TABLE_NAME)
      .where('taskId', taskId)
      .del().delete(taskId);
  },
};
