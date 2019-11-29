const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const moment = require('moment');
const tasksManager = require('./tasksManager');
const listsManager = require('./listsManager');

const app = new Koa();
const router = new Router();

app.use(require('koa-static')('public'));

const TASKS_LIST_ROUTE_NAME = 'tasksList';

router.post('/tasks-list', async ctx => {
    const list = await listsManager.findOne(ctx.request.query.listId);
    await tasksManager.addTask(ctx.request.body.task, list.listId);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${list.listId}`);
});
router
  .post('/add-list', async ctx => {
    const listId = await listsManager.addList(ctx.request.body.name);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${listId}`);
  })
  .get('/', async ctx => {
    const list = await listsManager.takeAll();
    await ctx.render('index', {list});
  })
  .post('/delete-task', async (ctx) => {
    await tasksManager.deleteOne(ctx.request.body.taskId);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.body.listId}`);
  })
  .post('/delete-list', async ctx => {
  await listsManager.deleteList(ctx.request.body.listId);
  ctx.redirect('/');
  })
  .get(TASKS_LIST_ROUTE_NAME, '/tasks-list', async ctx => {
    const list = await listsManager.findOne(ctx.request.query.listId);
    const tasks = await tasksManager.getAllTasks(list.listId);
    await ctx.render('tasksList', { tasks, moment, list });
  });

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
