const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const userRoutes = require('./routes/userRoutes');
const listsRoutes = require('./routes/listsRoutes');
const tasksRoutes = require('./routes/tasksRoutes');

const session = require('koa-session');
const app = new Koa();

app.keys = ['some secret hurr'];
app.use(session(app));

app.use(require('koa-static')('public'));

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'html',
  cache: false,
  debug: false,
});

app
    .use(bodyParser())
    .use(async (ctx, next) => {
      ctx.state.userName = ctx.session.userName || '';
      await next();
    })
    .use(userRoutes.routes())
    .use(userRoutes.allowedMethods())
    .use(listsRoutes.routes())
    .use(listsRoutes.allowedMethods())
    .use(tasksRoutes.routes())
    .use(tasksRoutes.allowedMethods());

app.listen(8080);


