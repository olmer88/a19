const knex = require('./knex');
const TABLE_NAME = 'tasks';
const TABLE_LISTS = 'lists';

module.exports = {
  async addTask(description, listId) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date(), listId});
  },
  async getAllTasksForList(listId) {
    return knex(TABLE_NAME).select().where('listId',listId).orderBy('done');
  },
  async deleteOne(taskId) {
  return knex(TABLE_NAME)
          .where('taskId', taskId)
          .delete(taskId);
  },
  async checkTrue(taskId) {
    return knex(TABLE_NAME).where('taskId', taskId).update({done:'1',doneAt:new Date()});
  },
  async checkFalse(taskId) {
    return knex(TABLE_NAME).where('taskId', taskId).update({done:'0',doneAt:null});
  },
  async getAllLists() {
    return knex(TABLE_LISTS).select();
  },
  async deleteList(listId) {
    await knex('tasks').select().where('listId',listId).delete();
    return knex(TABLE_LISTS)
        .where('listId',listId)
        .delete();
  },
  async taskMoveUp(targetId, targetToChange) {
    const [targetIdData] = await knex(TABLE_NAME).select().where('taskId', targetId);
    const [targetToChangeData] = await knex(TABLE_NAME).select().where('taskId', targetToChange);
    await knex(TABLE_NAME).where('taskId', targetId).update({createdAt: targetToChangeData.createdAt, description: targetToChangeData.description});
    return  knex(TABLE_NAME).where('taskId', targetToChange).update({createdAt: targetIdData.createdAt, description: targetIdData.description});
  }
};
