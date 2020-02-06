const userManager = require('../managers/usersManager');
const listsManager = require('../managers/listsManager');
const {isValidMessage} = require('./../utils/privatKey');
const qs = require('qs');


const usersManager = require('../managers/usersManager');



module.exports = {
    async checkUserName(ctx) {
        const {name} = ctx.request.query;
        const [user] = await userManager.findOne(name);
        if (user) {
            ctx.response.body = {
                user: true,
            }
        } else {
            ctx.response.body = {
                user: true,
            }
        }
    },

    async addUser(ctx, next) {
        const {userName, password} = ctx.request.body;
        try {
            await usersManager.addUser(userName, password);
        } catch (e) {
            const queryString = `/login?${qs.stringify({message: 'duplicate name'})}`;
            return ctx.redirect(queryString)
        }
        ctx.redirect('/login');
    },

    async showAllUsers(ctx) {
        if(ctx.session.userId){
            ctx.redirect('/lists');
            return;
        }
        const {message} = ctx.request.query;

        ctx.state.msg = isValidMessage(message) ? 'name already exist' : '';

        const users = await usersManager.getAllUsers();
        await ctx.render('login', {users});
    },

    async login(ctx) {
        const {userName, password} = ctx.request.body;
        const [user] = await usersManager.loginIn(userName, password);
        if (user) {
            ctx.session.userId = user.userId;
            ctx.session.userName = user.userName;
            ctx.redirect('/lists');
            return;
        }
        ctx.redirect('/login');
    },

    async logOut(ctx) {
        /*    ctx.session.userId = undefined;
            ctx.session.userName = undefined;*/
        ctx.session = null;
        ctx.redirect('/login');
    },

    async deleteUser(ctx) {
        const { userId } = ctx.request.query;
        const listsId = await listsManager.getAllLists(userId).then(data => data.map(el => el.listId));

        await (async (listsId) => {
            let promises = [];
            for (let i = 0; i < listsId.length; i++) {
                promises.push(listsManager.deleteList(listsId[i]));
            }
            await Promise.all(promises);
        })(listsId);

        await usersManager.deleteUser(userId);
        ctx.session = null;
        ctx.redirect('/login');
    },
};
