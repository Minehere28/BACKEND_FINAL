import taskService from '../services/task.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import mongoose from 'mongoose';


export const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getAllTasks(req.query);

  res.status(200).json({
    success: true,
    results: tasks.length,
    data: {
      tasks
    }
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  console.log('==> Vào getTask controller');

  const id = req.params.id;

  // 🔥 BỔ SUNG kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('❌ ID không hợp lệ:', id);
    return next(new AppError('ID không hợp lệ', 400));
  }

  const task = await taskService.getTaskById(id);

  if (!task) {
    console.log('⚠️ Không tìm thấy task với ID:', id);
    return next(new AppError('Không tìm thấy task với ID này', 404));
  }

  console.log('✅ Tìm thấy task:', task);

  res.status(200).json({
    success: true,
    data: {
      task
    }
  });
});


export const createTask = catchAsync(async (req, res, next) => {
  const taskData = {
    ...req.body,
    creator: req.user.id
  };
  
  const task = await taskService.createTask(taskData);

  res.status(201).json({
    success: true,
    data: {
      task
    }
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const task = await taskService.updateTask(
    req.params.id, 
    req.body
  );

  if (!task) {
    return next(new AppError('Không tìm thấy task với ID này', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      task
    }
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  await taskService.deleteTask(req.params.id);
  
  res.status(204).json({
    success: true,
    data: null
  });
});
