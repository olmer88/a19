const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const userRoutes = require('./routes/userRoutes');
const listsRoutes = require('./routes/listsRoutes');
const tasksRoutes = require('./routes/tasksRoutes');
const roomsRoutes = require('./routes/roomsRoutes');

const Router = require('koa-router');
const router = new Router();
const fs = require('fs');

/*GraphQL*/
const cors = require('koa-cors');
const qraphqlHTTP = require('koa-graphql');
const { buildSchema } = require('graphql');
const mount = require('koa-mount');
const db = require('./resolvers');

const schema = buildSchema(`
type Quote {
        id: ID!
        quote: String!
        author: String!
    }
     type Query {
        hello: String!
        quotes: [Quote]
        quote(id: ID!): [Quote]
    }
    type Mutation {
        addQuote(quote: String!, author: String!): [Quote]
    }
    
`);

const root = {
    hello: ( {}, context, info) => context.body = 'Hello graphQL',
    quote: ( {id} , context, info) => context.body = db.Query.getQuote(id),
    quotes: () => db.Query.getQuotes(),
};


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
    .use(cors())
    .use(bodyParser())
    .use(mount('/graphql', qraphqlHTTP({
        schema: schema,
        rootValue: root,
        /* graphiql: true,*/
    })))
    .use(async (ctx, next) => {
        ctx.state.userName = ctx.session.userName || '';
        await next();
    })
    .use(userRoutes.routes())
    .use(listsRoutes.routes())
    .use(tasksRoutes.routes())
    .use(roomsRoutes.routes());


app.listen(8080, () => {
    console.log('Server has been started on http://127.0.0.1:8080')
});


