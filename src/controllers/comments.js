const Comment = require('../models/Comment');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get comments for task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.taskId}`, 404)
    );
  }

  // Make sure user is task creator or team member
  if (task.creator.toString() !== req.user.id && 
      (!req.user.team || task.team.toString() !== req.user.team.toString())) {
    return next(
      new ErrorResponse(`Not authorized to access this task`, 401)
    );
  }

  const comments = await Comment.find({ task: req.params.taskId })
    .populate('user', 'username');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.task = req.params.taskId;
  req.body.user = req.user.id;

  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.taskId}`, 404)
    );
  }

  // Make sure user is task creator or team member
  if (task.creator.toString() !== req.user.id && 
      (!req.user.team || task.team.toString() !== req.user.team.toString())) {
    return next(
      new ErrorResponse(`Not authorized to comment on this task`, 401)
    );
  }

  const comment = await Comment.create(req.body);

  // Add comment to task
  task.comments.push(comment._id);
  await task.save();

  res.status(201).json({
    success: true,
    data: comment
  });
});