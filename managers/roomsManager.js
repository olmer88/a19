const knex = require('../knex');

const TABLE_NAME = "rooms";
const TABLE_NAME_PARTICIPANT = "roomsParticipant";
const TABLE_NAME_TASKS = "roomsTasks";

module.exports = {
    async getUsersRooms(userId) {
        return (await knex(TABLE_NAME_PARTICIPANT)
            .select('name', 'rooms.roomId', 'createdBy')
            .join('rooms', 'roomsParticipant.roomId', 'rooms.roomId')
            .where('roomsParticipant.userId', userId))/*.map(({name}) => name)*/;
    },

     getRoomsWhereUserNotExist(userId) {
        return knex(TABLE_NAME)
            .select('name', 'rooms.roomId')
            .whereNotIn(`${TABLE_NAME}.roomId`, knex(TABLE_NAME).select(`${TABLE_NAME}.roomId`)
                .join(TABLE_NAME_PARTICIPANT, `${TABLE_NAME_PARTICIPANT}.roomId`, `${TABLE_NAME}.roomId`)
                .where(`${TABLE_NAME_PARTICIPANT}.userId`, userId)
            );
    },

    async createRoom(name, userId) {
         await knex(TABLE_NAME)
            .insert({name: name, createdBy: userId});
        const roomId = knex(TABLE_NAME).select('roomId').where( 'name' ,name);
        return  knex(TABLE_NAME_PARTICIPANT).insert({roomId, userId});
    },

    async deleteRoom(roomId){
        await knex(TABLE_NAME_TASKS).where( 'roomId', roomId).del();
        await knex(TABLE_NAME_PARTICIPANT).where('roomId', roomId).del();
        return  knex(TABLE_NAME).where('roomId', roomId).del();
    },

     joinToRoom(roomId, userId) {
        return knex(TABLE_NAME_PARTICIPANT).insert({roomId, userId});
    },

     leaveRoom(roomId, userId) {
      return knex(TABLE_NAME_PARTICIPANT).where('roomId', roomId).andWhere('userId', userId).del();
    },

    roomTasks(roomId) {
        return knex(TABLE_NAME_TASKS).where('roomId', roomId);
    },

    addTask(description, taskCreatedBy, roomId, createdByName) {
        return knex(TABLE_NAME_TASKS).insert({description, taskCreatedBy, roomId, createdAt: new Date(), createdByName});
    },

    deleteTask(roomTaskId) {
        return knex(TABLE_NAME_TASKS).where('roomTaskId', roomTaskId).del();
    },

    isAdmin(roomId, userId) {
        return knex(TABLE_NAME).where('roomId', roomId).andWhere('createdBy', userId);
    },
};
