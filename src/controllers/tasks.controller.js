const Task = require('../models/task');
const taskController= {};

taskController.getTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
};

taskController.getTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task)
}

taskController.addTask = async (req, res) => {
    const { name, coords:lat,long } = req.body;
    const task = new Task({name, coords: lat,long});
    await task.save();
    res.json({status: 'Task Saved'});
};

taskController.updateTask = async (req, res) => {
    const { name, coords:lat,long } = req.body;
    const newTask = {name, coords: lat,long};
    await Task.findByIdAndUpdate(req.params.id, newTask);
    res.json({status: 'Task Updated'});
};

taskController.deleteTask = async (req, res) => {
    await Task.findByIdAndRemove(req.params.id);
    res.json({status: 'Task Deleted'});
};

module.exports = taskController;