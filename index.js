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
    await tasksManager.addTask(ctx.request.body.task, ctx.request.query.listId);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.query.listId}`);
});
router
  .post('/add-list', async ctx => {
    const listId = await listsManager.addList(ctx.request.body.name);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${listId}`);
  })
  .get('/', async ctx => {
    const lists = await tasksManager.getAllLists();
    await ctx.render('index', {lists});
  })
  .post('/delete-task', async (ctx) => {
    await tasksManager.deleteOne(ctx.request.body.taskId);
    ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.body.listId}`);
  })
  .post('/delete-list', async ctx => {
  await tasksManager.deleteList(ctx.request.body.listId);
  ctx.redirect('/');
  })
  .post('/checked',async ctx => {
  if(ctx.request.body.checked === 'true') {
    await tasksManager.checkTrue(ctx.request.body.taskId);
  } else {
    await tasksManager.checkFalse(ctx.request.body.taskId);
  }
  ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.body.listId}`);
  })
  .post('/moveUp', async ctx => {
    const tasksArray = [];
    const tasks = await tasksManager.getAllTasksForList(ctx.request.body.listId);
    tasks.forEach(v => !v.done?tasksArray.push(v['taskId']):v);
    if(tasksArray.indexOf(+ctx.request.body.targetId) === 0) {
      ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.body.listId}`);
    } else {
      const target = +ctx.request.body.targetId;
      const targetToChange = tasksArray[+(tasksArray.indexOf(target))-1];
      await tasksManager.taskMoveUp(target, targetToChange);
      ctx.redirect(router.url(TASKS_LIST_ROUTE_NAME) + `?listId=${ctx.request.body.listId}`);
    }
  })
  .get(TASKS_LIST_ROUTE_NAME, '/tasks-list', async ctx => {
    const list = await listsManager.findOne(ctx.request.query.listId);
    const tasks = await tasksManager.getAllTasksForList(list.listId);
    await ctx.render('tasksList', { tasks, moment, list});
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
