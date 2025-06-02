import * as subBoardService from '../services/subBoard.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const createSubBoard = async (req, res) => {
  try {
    console.log('[Controller] ✅ createSubBoard called');
    const { taskId } = req.params;
    const { name } = req.body;

    if (!name || !taskId) {
      return res.status(400).json({ message: 'Thiếu tên hoặc taskId!' });
    }

    const subBoard = await subBoardService.createSubBoard(taskId, name);
    return res.status(201).json({ success: true, data: subBoard });
  } catch (err) {
    console.error('[Controller] ❌ Error in createSubBoard:', err);
    return res.status(500).json({ message: 'Đã xảy ra lỗi server!' });
  }
};


export const updateSubBoard = catchAsync(async (req, res, next) => {
  const subBoard = await subBoardService.updateSubBoard(
    req.params.id,
    req.body
  );

  if (!subBoard) {
    return next(new AppError('Không tìm thấy sub-board với ID này', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      subBoard
    }
  });
});

export const deleteSubBoard = catchAsync(async (req, res, next) => {
  await subBoardService.deleteSubBoard(req.params.id);
  
  res.status(204).json({
    success: true,
    data: null
  });
});

export const uploadBackground = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Vui lòng tải lên một hình ảnh', 400));
  }

  const subBoard = await subBoardService.uploadBackground(
    req.params.id,
    req.file.path
  );

  res.status(200).json({
    success: true,
    data: {
      subBoard
    }
  });
});