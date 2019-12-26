const moment = require('moment');
const tasksManager = require('../managers/tasksManager');
const listsManager = require('../managers/listsManager');
const { makeListTasksUrl } = require('../managers/urlBuilder');

module.exports = {
  async addTask(ctx) {
    await tasksManager.addTask(ctx.request.body.task, ctx.request.query.listId);
    ctx.redirect(makeListTasksUrl(ctx.request.query.listId));
  },
  async addList(ctx) {
    const listId = await listsManager.addList(ctx.request.body.name);
    ctx.redirect(makeListTasksUrl(listId));
  },
  async showAllLists(ctx) {
    let { views = 0 } = ctx.session;
    views += 1;
    ctx.session = { views };
    const lists = await listsManager.getAllLists();
    await ctx.render('index', { lists, views });
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
