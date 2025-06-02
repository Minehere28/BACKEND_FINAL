import * as commentService from '../services/comment.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const addComment = catchAsync(async (req, res, next) => {
  const comment = await commentService.createComment(
    req.params.taskId,
    req.user.id,
    req.body.content
  );

  res.status(201).json({
    success: true,
    data: {
      comment
    }
  });
});

export const getComments = catchAsync(async (req, res, next) => {
  const comments = await commentService.getTaskComments(req.params.taskId);

  res.status(200).json({
    success: true,
    results: comments.length,
    data: {
      comments
    }
  });
});
