const Router = require('koa-router');

const router = new Router({prefix: '/test' });

router.get('/', (ctx,next) => {
     ctx.body = 'hello from test!';
     return next();
});

module.exports = router;