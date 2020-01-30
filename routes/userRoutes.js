const Router = require('koa-router');
const router = new Router({prefix: ''});
const userController = require('./../controllers/userController');

router
    .get('/', (ctx) => ctx.redirect('/login'))
    .get('/login', userController.showAllUsers)
    .get('/delete-user', userController.deleteUser)
    .post('/signIn', userController.addUser)
    .post('/login', userController.login)
    .post('/logOut', userController.logOut)
    .get('/user',userController.checkUserName);

module.exports = router;