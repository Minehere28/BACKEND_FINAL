import authService from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const register = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.register({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    teamId: req.body.teamId
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
