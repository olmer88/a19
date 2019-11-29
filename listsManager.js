const knex = require('./knex');

const TABLE_NAME = 'lists';
module.exports = {
  async addList(name) {
    const [listId] = await knex(TABLE_NAME).insert({ name });
    return listId;
  },
  async findOne(listId) {
    const [list] = await knex(TABLE_NAME).where('listId', listId).select();
    return list;
  },
  async takeAll() {
    const list = await knex(TABLE_NAME).select();
    //console.log(list);
    return list;
  },
  async deleteList(listId) {
    console.log('del');
    await knex('tasks').select().where('listId',listId).delete();
    return knex(TABLE_NAME)
        .where('listId',listId)
        .delete();
  }
};
