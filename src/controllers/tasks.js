const Task = require('../models/Task');
const SubBoard = require('../models/SubBoard');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('creator team subBoards comments');

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task creator or team member
  if (task.creator.toString() !== req.user.id && 
      (!req.user.team || task.team.toString() !== req.user.team.toString())) {
    return next(
      new ErrorResponse(`Not authorized to access this task`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id;

  const task = await Task.create(req.body);

  // Create default subboards
  const subBoards = await SubBoard.create([
    { name: 'TODO', task: task._id },
    { name: 'IN PROGRESS', task: task._id },
    { name: 'IN REVIEW', task: task._id },
    { name: 'DONE', task: task._id }
  ]);

  // Add subboards to task
  task.subBoards = subBoards.map(sb => sb._id);
  await task.save();

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task creator or admin
  if (task.creator.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new ErrorResponse(`Not authorized to update this task`, 401)
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task creator or admin
  if (task.creator.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new ErrorResponse(`Not authorized to delete this task`, 401)
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});