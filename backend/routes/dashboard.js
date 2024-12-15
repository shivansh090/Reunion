const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user });
    const completedTasks = await Task.countDocuments({ user: req.user, status: 'finished' });
    const pendingTasks = totalTasks - completedTasks;

    const percentCompleted = (completedTasks / totalTasks) * 100 || 0;
    const percentPending = (pendingTasks / totalTasks) * 100 || 0;

    const now = new Date();
    const pendingTasksData = await Task.find({ user: req.user, status: 'pending' });

    let timeLapsedByPriority = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let balanceEstimateByPriority = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let countPendingByPriority = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let totalPendingTimeLapsed = 0; // Total time lapsed for pending tasks
    let totalTimeToFinish = 0; // Total estimated time to finish pending tasks

    pendingTasksData.forEach(task => {
      const timeLapsed = (now - task.startTime) / (1000 * 60 * 60); // in hours
      const balanceEstimate = Math.max((task.endTime - now) / (1000 * 60 * 60), 0); // in hours

      totalPendingTimeLapsed += timeLapsed;
      totalTimeToFinish += balanceEstimate;

      countPendingByPriority[task.priority] += 1;
      timeLapsedByPriority[task.priority] += timeLapsed;
      balanceEstimateByPriority[task.priority] += balanceEstimate;
    });

    const completedTasksData = await Task.find({ user: req.user, status: 'finished' });
    const totalCompletionTime = completedTasksData.reduce((sum, task) => {
      return sum + (task.endTime - task.startTime) / (1000 * 60 * 60);
    }, 0);

    const averageCompletionTime = totalCompletionTime / completedTasks || 0;

    // Get task completion data for the last 7 days
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Midnight today
    
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000); // Midnight 7 days ago
    
    // Create an array of the last 7 days (including today)
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      dates.push(dateString);
    }
    
    // Initialize the taskCompletionChart to store the results
    const taskCompletionChart = [];
    
    // Fetch tasks for each date and aggregate counts
    for (let i = 0; i < dates.length; i++) {
      const currentDate = dates[i];
    
      // Query the tasks for the current date
      const tasksForTheDay = await Task.find({
        user: req.user, // Ensure the tasks belong to the user
        status: 'finished',
        endTime: {
          $gte: new Date(currentDate + "T00:00:00Z"), // Start of the day
          $lt: new Date(currentDate + "T23:59:59Z") // End of the day
        }
      });
    
      // Push the result into the taskCompletionChart array
      taskCompletionChart.push({
        date: currentDate,
        completed: tasksForTheDay.length // Count the number of tasks for the day
      });
    }
    


    res.json({
      totalTasks,
      percentCompleted,
      percentPending,
      pendingTasks,
      totalPendingTimeLapsed: totalPendingTimeLapsed.toFixed(2),
      totalTimeToFinish: totalTimeToFinish.toFixed(2),
      countPendingByPriority,
      timeLapsedByPriority,
      balanceEstimateByPriority,
      averageCompletionTime,
      taskCompletionChart
    });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

module.exports = router;
