const knex = require('../knex');
const tasksManager = require('./tasksManager');

const TABLE_NAME = 'lists';
module.exports = {
  async addList(name, userId) {
    const [listId] = await knex(TABLE_NAME).insert({ name, userId });
    return listId;
  },
  async findOne(listId) {
    const [list] = await knex(TABLE_NAME).where('listId', listId).select();
    return list;
  },
  async deleteList(listId) {
    await tasksManager.deleteListTasks(listId);
    return knex(TABLE_NAME)
      .where('listId', listId)
      .delete();
  },
  async getAllLists(userId) {
    return knex(TABLE_NAME).select().where({userId : userId});
  },
};
