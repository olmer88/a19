const moment = require('moment');
const tasksManager = require('../managers/tasksManager');
const listsManager = require('../managers/listsManager');
const userManager = require('../managers/usersManager');
const {makePrivateKeyKey, isValidMessage, publicKey} = require('./../utils/privatKey');
const qs = require('qs');


const usersManager = require('../managers/usersManager');

const { makeListTasksUrl } = require('../managers/urlBuilder');

module.exports = {
  async checkUserName(ctx) {
    const {name} = ctx.request.query;
    const [user] = await userManager.findOne(name);
    if(user) {
      ctx.response.body = {
        user: true,
      }
    }else{
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
      const queryString = `/login?${qs.stringify({message:'duplicate name'})}`;
      //console.log(qs.parse(queryString));
      return ctx.redirect(queryString)
    }
    ctx.redirect('/login');
  },

  async showAllUsers(ctx) {
    const { message } = ctx.request.query;

    ctx.state.msg = isValidMessage(message) ? 'name already exist' : '';

    const users = await usersManager.getAllUsers();
    await ctx.render('login', {users});
  },

  async login(ctx) {
    const {userName, password} = ctx.request.body;
    const [user] = await usersManager.loginIn(userName, password);
    if(user){
      ctx.session.userId = user.userId;
      ctx.session.userName = user.userName;
      ctx.redirect('/');
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
  async addTask(ctx) {
    await tasksManager.addTask(ctx.request.body.task, ctx.request.query.listId);
    ctx.redirect(makeListTasksUrl(ctx.request.query.listId));
  },
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
  async deleteTask(ctx) {
    await tasksManager.deleteOne(ctx.request.body.taskId);
    ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
  },
  async deleteList(ctx) {
    await listsManager.deleteList(ctx.request.body.listId);
    ctx.redirect('/');
  },
  async checkTask(ctx) {
    const taskId = ctx.request.body.taskId;
    if (ctx.request.body.checked === 'true') {
      await tasksManager.check(taskId);
    } else {
      await tasksManager.uncheck(taskId);
    }
    const task = await tasksManager.findOneById(taskId);
    ctx.redirect(makeListTasksUrl(task.listId));
  },
  async moveUp(ctx) {
    const tasksArray = [];
    const tasks = await tasksManager.getAllTasksForList(ctx.request.body.listId);
    tasks.forEach(v => !v.done ? tasksArray.push(v['taskId']) : v);
    if (tasksArray.indexOf(+ctx.request.body.targetId) === 0) {
      ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
    } else {
      const target = +ctx.request.body.targetId;
      const targetToChange = tasksArray[+(tasksArray.indexOf(target)) - 1];
      await tasksManager.taskMoveUp(target, targetToChange);
      ctx.redirect(makeListTasksUrl(ctx.request.body.listId));
    }
  },
  async showListTasks(ctx) {
    const list = await listsManager.findOne(ctx.request.query.listId);
    const tasks = await tasksManager.getAllTasksForList(list.listId);
    await ctx.render('tasksList', { tasks, moment, list });
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
    ctx.redirect('/');
  },
};
