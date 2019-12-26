const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const routes = require('./routes');

const app = new Koa();
app.use(session({ signed: false }, app));

app.use(require('koa-static')('public'));

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'html',
  cache: false,
  debug: false,
});

app
  .use(bodyParser())
  .use(routes)
;

app.listen(8080);
