const TasksManager = require('./TasksManager');

const tasksManager = new TasksManager();
describe('tasksManager', () => {
  it('should add the task', () => {
    tasksManager.addTask('my task');
    const task = tasksManager.getAllTasks()[0];
    expect(task).toBe('my task');
  });
});
