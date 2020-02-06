const knex = require('./knex');
const TABLE_NAME = "quotes";

module.exports = {
    Query: {
        async getQuotes() {
            return knex(TABLE_NAME);
        },
        async getQuote(id) {
            return knex(TABLE_NAME).where("id", id);
        }
    },
    Mutation: {
        async addQuote(quote, author) {
            return knex(TABLE_NAME).insert({quote, author});
        },
    },
};
