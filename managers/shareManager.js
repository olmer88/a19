const knex = require('../knex');

const TABLE_NAME = 'sharedLists';

module.exports = {
  addSharedList: ({ userId, listId }) => knex(TABLE_NAME).insert({ userId, listId }),
  async findUserIdsByListId(listId) {
    const sharedLists = await knex(TABLE_NAME).select().where('listId', listId);
    return sharedLists.map(({ userId }) => userId);
  },
};
