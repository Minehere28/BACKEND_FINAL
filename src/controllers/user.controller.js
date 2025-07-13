import * as userService from '../services/user.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// POST /users – Tạo người dùng (Chỉ Admin)
export const createUser = catchAsync(async (req, res, next) => {
  const { username, password, role, email } = req.body;
  if (!username || !password || !role || !email) {
    return next(new AppError('Vui lòng cung cấp username, password và role', 400));
  }
  const user = await userService.createUser({ username, password, role, email});
  res.status(201).json({
    success: true,
    data: { user }
  });
});

// GET /users – Liệt kê tất cả người dùng (Chỉ Admin, có phân trang)
export const getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const users = await userService.getAllUsers({ page, limit });
  res.status(200).json({
    success: true,
    data: users
  });
});

// GET /users/me – Lấy thông tin người dùng theo ID (Chỉ Admin)
export const getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getUserProfile(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

//PUT /users/me – Cập nhật thông tin người dùng (Chỉ Admin hoặc người dùng đó)
export const updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateUserProfile(
    req.user.id, 
    {
      username: req.body.username,
    }
  );

  res.status(200).json({
    success: true,
    data: {
      user: updatedUser
    }
  });
});

// DELETE /users/:id – Xóa người dùng (Chỉ Admin)
export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.status(204).json({
    success: true,
    data: null
  });
});