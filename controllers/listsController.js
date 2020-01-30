const listsManager = require('../managers/listsManager');

const { makeListTasksUrl } = require('../managers/urlBuilder');

module.exports = {
    async addList(ctx) {
        const {userId} = ctx.session;
        const listId = await listsManager.addList(ctx.request.body.name, userId);
        ctx.redirect(makeListTasksUrl(listId));
    },

    async showAllLists(ctx) {
        const {userId} = ctx.session;
        if(!userId){
            ctx.redirect('/login');
            return ;
        }
        await listsManager.doneUndone(userId);
        const lists = await listsManager.getAllLists(userId);

        await ctx.render('index', { lists, userId });
    },

    async deleteList(ctx) {
        await listsManager.deleteList(ctx.request.body.listId);
        ctx.redirect('/lists');
    },
};