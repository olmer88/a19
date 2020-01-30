const moment = require('moment');
const tasksManager = require('../managers/tasksManager');
const listsManager = require('../managers/listsManager');
const usersManager = require('../managers/usersManager');
const { makeListTasksUrl } = require('../managers/urlBuilder');
const securityManager = require('../managers/securityManager');
const qs = require('qs');

module.exports = {
  async register(ctx) {
    const { name, password } = ctx.request.body;
    let msg = '';
    try {
      ctx.session.userId = await usersManager.addUser(name, password);
    } catch (e) {
      console.log(e);
      msg = 'Duplicate name';
    }
    ctx.session.name = name;
    const queryString = qs.stringify({ msg, publicKey: securityManager.makePublicKey(msg) });
    ctx.redirect(`/?${queryString}`);
  },
  async login(ctx) {
    const { name, password } = ctx.request.body;
    const { userId } = await usersManager.findOne(name, password);
    ctx.session.userId = userId;
    ctx.session.name = name;
    ctx.redirect('/');
  },
  async addTask(ctx) {
    await tasksManager.addTask(ctx.request.body.task, ctx.request.query.listId);
    ctx.redirect(makeListTasksUrl(ctx.request.query.listId));
  },
  async addList(ctx) {
    const listId = await listsManager.addList(ctx.request.body.name);
    ctx.redirect(makeListTasksUrl(listId));
  },
  async showAllLists(ctx) {
    const { msg, publicKey } = ctx.query;
    ctx.state.msg = securityManager.isMessageValid(msg, publicKey) ? msg : '';
    const lists = await listsManager.getAllLists();
    await ctx.render('index', { lists });
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
};
