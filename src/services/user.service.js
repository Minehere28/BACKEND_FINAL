import User from '../models/user.js';
import AppError from '../utils/appError.js';

export const getUserProfile = async (userId) => {
  return await User.findById(userId).select('-password -__v');
};

export const updateUserProfile = async (userId, updateData) => {
  if (updateData.password) {
    throw new AppError('This route is not for password updates.', 400);
  }

  const filteredBody = {};
  if (updateData.username) filteredBody.username = updateData.username;
  if (updateData.teamId) filteredBody.teamId = updateData.teamId;

  return await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password -__v');
};
