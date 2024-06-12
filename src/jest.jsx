const Task = require('./models/task');
const { deleteExpiredTasks } = require('./taskService');

jest.useFakeTimers();

describe('Task deletion after deadline', () => {
  it('should delete tasks after 10 hours past their deadline', async () => {
    // Create a task with a deadline 11 hours ago
    const deadline = new Date();
    deadline.setHours(deadline.getHours() - 11);
    const task = new Task({ deadline });
    await task.save();

    // Call the function to delete expired tasks
    await deleteExpiredTasks();

    // Expect the task to be deleted
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});
