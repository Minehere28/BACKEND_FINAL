const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Task = require('../models/Task');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    advancedResults(Task, 'creator team subBoards comments'),
    getTasks
  )
  .post(protect, authorize('Admin'), createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, authorize('Admin'), updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

module.exports = router;