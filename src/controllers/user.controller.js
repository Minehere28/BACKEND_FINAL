import * as userService from '../services/user.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getUserProfile(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateUserProfile(
    req.user.id, 
    {
      username: req.body.username,
      teamId: req.body.teamId
    }
  );

  res.status(200).json({
    success: true,
    data: {
      user: updatedUser
    }
  });
});