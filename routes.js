const Router = require('koa-router');
const indexController = require('./controllers/indexController');

const router = new Router();

router
    .get('/delete-user', indexController.deleteUser)
    .get('/login', indexController.showAllUsers)
    .post('/signIn', indexController.addUser)
    .post('/login', indexController.login)
    .post('/logOut', indexController.logOut)
    .get('/', indexController.showAllLists)
    .post('/tasks-list', indexController.addTask)
    .get('/tasks-list', indexController.showListTasks)
    .post('/add-list', indexController.addList)
    .post('/delete-task', indexController.deleteTask)
    .post('/delete-list', indexController.deleteList)
    .post('/check-task', indexController.checkTask)
    .post('/moveUp', indexController.moveUp)
;




module.exports = router.routes();