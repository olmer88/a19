const knex = require('../knex');
const TABLE_NAME = 'tasks';

const checkDone = (taskId, isDone) => knex(TABLE_NAME)
  .where('taskId', taskId)
  .update({ doneAt: isDone ? new Date() : null });

module.exports = {

  async findOneById(taskId) {
    const [task] = await knex(TABLE_NAME).select().where('taskId', taskId);
    return task;
  },
  async addTask(description, listId) {
    return knex(TABLE_NAME).insert({ description, createdAt: new Date(), listId });
  },
  async getAllTasksForList(listId) {
    return knex(TABLE_NAME).select().where('listId', listId).orderBy('doneAt');
  },
  async deleteOne(taskId) {
    return knex(TABLE_NAME)
      .where('taskId', taskId)
      .delete(taskId);
  },
  check: taskId => checkDone(taskId, true),
  uncheck: taskId => checkDone(taskId, false),
  deleteListTasks(listId) {
    return knex('tasks').select().where('listId', listId).delete();
  },
  async taskMoveUp(targetId, targetToChange) {
    const [targetIdData] = await knex(TABLE_NAME).select().where('taskId', targetId);
    const [targetToChangeData] = await knex(TABLE_NAME).select().where('taskId', targetToChange);
    await knex(TABLE_NAME)
      .where('taskId', targetId)
      .update(
        { createdAt: targetToChangeData.createdAt, description: targetToChangeData.description });
    return knex(TABLE_NAME)
      .where('taskId', targetToChange)
      .update({ createdAt: targetIdData.createdAt, description: targetIdData.description });
  },
  async getAllTasksForUser(userId){
    return knex(TABLE_NAME)
        .join('lists', `${TABLE_NAME}.listId`, 'lists.listId')
        .where('lists.userId', userId);
  },
  async deleteAllDone(listId) {
    return knex(TABLE_NAME)
        .select('listId')
        .whereNotNull('doneAt').and
        .where({listId})
        .del();
  }
};
