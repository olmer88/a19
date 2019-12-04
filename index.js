const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const indexController = require('./controllers/indexController');

const app = new Koa();
const router = new Router();

app.use(require('koa-static')('public'));

router
  .get('/', indexController.showAllLists)
  .post('/tasks-list', indexController.addTask)
  .get('/tasks-list', indexController.showListTasks)
  .post('/add-list', indexController.addList)
  .post('/delete-task',  indexController.deleteTask)
  .post('/delete-list', indexController.deleteList)
  .post('/check-task', indexController.checkTask)
  .post('/moveUp', indexController.moveUp)
;

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'html',
  cache: false,
  debug: false,
});

app
  .use(bodyParser())
  .use(router.routes())
;

app.listen(8080);
