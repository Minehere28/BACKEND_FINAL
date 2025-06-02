import Comment from '../models/comment.js';
import Task from '../models/task.js';

export const createComment = async (taskId, userId, content) => {
  const comment = await Comment.create({
    content,
    task: taskId,
    user: userId,
  });
  await Task.findByIdAndUpdate(taskId, { $push: { comments: comment._id } });
  return comment;
};

export const getTaskComments = async (taskId) => {
  return await Comment.find({ task: taskId }).populate('user', 'username');
};
