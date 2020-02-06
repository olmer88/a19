const Router = require('koa-router');
const router = new Router({prefix: '/rooms'});
const roomsController = require('./../controllers/roomsController');

const isUser = async (ctx, next) => {
    const {userId} = ctx.session;
    if(!userId){
        return await ctx.redirect('/login');
    }
    return await next();
};

router
    .get('/', isUser, roomsController.showRoomsPage)
    .post('/createRoom',isUser, roomsController.createRoom)
    .get('/deleteRoom', isUser, roomsController.deleteRoom)
    .get('/join', isUser, roomsController.joinToRoom)
    .get('/leave', isUser, roomsController.leaveRoom)

    .get('/room', isUser, roomsController.showRoom)
    .post('/room/addTask', isUser, roomsController.addTask)
    .get('/room/deleteTask', isUser, roomsController.deleteTask);

module.exports = router;
