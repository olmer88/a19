const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const indexController = require('./controllers/indexController');

const session = require('koa-session');

const app = new Koa();
const router = new Router();


app.keys = ['some secret hurr'];
app.use(session(app));

app.use(require('koa-static')('public'));

router
  .get('/login', indexController.showAllUsers)
    .post('/signIn', indexController.addUser)
    .post('/login', indexController.login)
    .post('/logOut', indexController.logOut)

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
