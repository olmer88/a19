const Router = require('koa-router');
const router = new Router({prefix: '/tasks'});
const tasksController = require('./../controllers/tasksController');

router
    .post('/check-task', tasksController.checkTask)
    .get('/tasks-list', tasksController.showListTasks)
    .post('/tasks-list', tasksController.addTask)
    .post('/delete-task', tasksController.deleteTask)
    .post('/moveUp', tasksController.moveUp);

module.exports = router;