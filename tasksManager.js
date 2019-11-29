const knex = require('./knex');
const TABLE_NAME = 'tasks';

module.exports = {
  async addTask(description, listId) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date(), listId});
  },
  async getAllTasks(listId) {
    return knex(TABLE_NAME).select().where('listId',listId);
  },
  async deleteOne(taskId) {
    return knex(TABLE_NAME)
      .where('taskId', taskId)
      /*.del(taskId);*/.delete(taskId);
  },
};
