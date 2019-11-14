module.exports = class TasksManager {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getAllTasks() {
    return this.tasks;
  }
};
