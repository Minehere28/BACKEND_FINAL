import SubBoard from '../models/subBoard.js';
import Task from '../models/task.js';

import mongoose from 'mongoose';

export const createSubBoard = async (taskId, name) => {
  console.log('[Service] 🛠 Creating subBoard for taskId:', taskId, 'with name:', name);

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error('ID task không hợp lệ!');
  }

  const subBoard = await SubBoard.create({ name, taskId });
  console.log('[Service] ✅ SubBoard created:', subBoard);

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $push: { subBoards: subBoard._id } },
    { new: true }
  );
  console.log('[Service] ✅ Task updated with new subBoard:', task);

  return subBoard;
};

export const uploadBackground = async (subBoardId, imageUrl) => {
  return await SubBoard.findByIdAndUpdate(
    subBoardId,
    { background: imageUrl },
    { new: true }
  );
};
