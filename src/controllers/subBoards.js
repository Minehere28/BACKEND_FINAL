const SubBoard = require('../models/SubBoard');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Upload background for subboard
// @route   PUT /api/subboards/:id/background
// @access  Private
exports.uploadBackground = asyncHandler(async (req, res, next) => {
  const subBoard = await SubBoard.findById(req.params.id);

  if (!subBoard) {
    return next(
      new ErrorResponse(`SubBoard not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user has permission
  const task = await Task.findById(subBoard.task);
  if (task.creator.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(
      new ErrorResponse(`Not authorized to update this subboard`, 401)
    );
  }

  if (!req.file) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  subBoard.background = req.file.path;
  await subBoard.save();

  res.status(200).json({
    success: true,
    data: subBoard
  });
});