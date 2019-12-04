const knex = require('knex');

module.exports = knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'monty',
    password: '',
    database: 'a19(2)',
  }
});
