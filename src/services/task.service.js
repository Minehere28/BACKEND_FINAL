import Task from '../models/task.js';

// Lấy tất cả task với các filter, sort, paginate (giả sử bạn có class APIFeatures)
import APIFeatures from '../utils/apiFeatures.js';

const getAllTasks = async (query) => {
  const features = new APIFeatures(Task.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  return await features.query;
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const createTask = async (taskData) => {
  return await Task.create(taskData);
};

const updateTask = async (id, updateData) => {
  return await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
