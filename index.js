const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');

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
    .use(routes);

app.listen(8080);
