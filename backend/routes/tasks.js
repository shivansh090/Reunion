const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching tasks', error: error.message });
  }
});



// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error: error.message });
  }
});

// Filter and sort tasks
router.get('/filter', auth, async (req, res) => {
  try {
    const { priority, status, sortBy } = req.query;
    let query = { user: req.user };
    if (priority) query.priority = priority;
    if (status) query.status = status;

    let sort = {};
    if (sortBy === 'startTime') sort.startTime = 1;
    if (sortBy === 'endTime') sort.endTime = 1;

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Error filtering tasks', error: error.message });
  }
});

module.exports = router;

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});
