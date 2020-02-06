const moment = require('moment');
const roomsManager = require('../managers/roomsManager');

const {makeRoomTasksUrl} = require('./../managers/urlBuilder');

module.exports = {
    async showRoomsPage(ctx) {
        const {userId} = ctx.session;
        const rooms = await roomsManager.getUsersRooms(userId);
        const otherRooms = await roomsManager.getRoomsWhereUserNotExist(userId);
        await ctx.render('rooms', { userId, rooms, otherRooms });
    },

    async createRoom(ctx) {
        const {userId} = ctx.session;
        const {name} = ctx.request.body;
        await roomsManager.createRoom(name, userId);
        ctx.redirect('/rooms');
    },

    async deleteRoom(ctx) {
        const {roomId} = ctx.request.query;
        await roomsManager.deleteRoom(roomId);
        ctx.redirect('/rooms');
    },
    async joinToRoom(ctx) {
        const {roomId} = ctx.request.query;
        const {userId} = ctx.session;
        await roomsManager.joinToRoom(roomId, userId);
        ctx.redirect('/rooms');
    },
    async leaveRoom(ctx) {
        const {roomId} = ctx.request.query;
        const {userId} = ctx.session;
        await roomsManager.leaveRoom(roomId, userId);
        ctx.redirect('/rooms');
    },
    async showRoom(ctx) {
        const {roomId} = ctx.request.query;
        const {userId} = ctx.session;
        const isAdmin = !!(await roomsManager.isAdmin(roomId, userId))[0];
        const tasks = await roomsManager.roomTasks(roomId) || [];
        console.log(isAdmin);
        await ctx.render('room', {moment, roomId, userId, tasks, isAdmin});
    },

    async addTask(ctx) {
        const {description, userId, roomId} = ctx.request.body;
        const { userName } = ctx.session;
        await roomsManager.addTask(description, userId, roomId, userName);
        ctx.redirect(makeRoomTasksUrl(roomId));
    },

    async deleteTask(ctx) {
        const {roomId, roomTaskId} = ctx.request.query;
        await roomsManager.deleteTask(roomTaskId);
        ctx.redirect(makeRoomTasksUrl(roomId));
    },
};
