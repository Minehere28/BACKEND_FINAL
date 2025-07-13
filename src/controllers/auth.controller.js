import authService from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const register = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.register({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
  });

  res.status(201).json({
    success: true,
    token,
    data: {
      user
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Vui lòng cung cấp username và password', 400));
  }

  const { user, token } = await authService.login(username, password);

  res.status(200).json({
    success: true,
    token,
    data: {
      user
    }
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Vui lòng cung cấp email', 400));
  }

  await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    message: 'Đã gửi email đặt lại mật khẩu nếu email tồn tại trong hệ thống.'
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Vui lòng cung cấp mật khẩu mới', 400));
  }

  await authService.resetPassword(token, password);

  res.status(200).json({
    success: true,
    message: 'Đặt lại mật khẩu thành công.'
  });
});


