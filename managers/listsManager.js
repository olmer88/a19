const knex = require('../knex');
const tasksManager = require('./tasksManager');

const TABLE_NAME = 'lists';
module.exports = {
  async doneUndone(userId){
    let list = await knex(TABLE_NAME).select().where({userId : userId});
    list = (Array.from(list).map(v => v.listId));
    for (let i = 0; i < list.length; i++){
      let [count] = await  knex('tasks').select().count('taskId').where({listId :list[i], doneAt : null});
      await knex(TABLE_NAME).where('listId', list[i]).update({unDone: Array.from(Object.entries(count))[0][1]});
    }
  },


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
