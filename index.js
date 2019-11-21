const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const tasksManager = require('./tasksManager');

const app = new Koa();
const router = new Router();

app.use(require('koa-static')('public'));

router.post('/', async ctx => {
  await tasksManager.addTask(ctx.request.body.task);
  ctx.redirect('/');
});
router
  .get('/', async ctx => {
    const tasks = await tasksManager.getAllTasks();
    await ctx.render('index', { tasks });
  })
;

render(app, {
  root: path.join(__dirname, 'view'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false,
});

app
  .use(bodyParser())
  .use(router.routes())
;

app.listen(8080);
