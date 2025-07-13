import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import crypto from 'crypto';

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Thiếu JWT_SECRET trong .env');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (userData) => {
  try {
    console.log('[auth.service.js] Register userData:', userData);

    const newUser = await User.create(userData);
    console.log('[auth.service.js] New user created:', newUser);

    const token = signToken(newUser._id);
    return { user: newUser, token };
  } catch (error) {
    console.error('[auth.service.js] Register error:', error);

    if (error.code === 11000 && error.keyPattern?.username) {
      throw new AppError('Tên người dùng đã tồn tại!', 400);
    }

    throw error;
  }
};

export const login = async (username, password) => {
  try {
    console.log('[auth.service.js] Login attempt:', username);

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      throw new AppError('Sai username hoặc password', 401);
    }

    if (!password || typeof password !== 'string') {
      throw new AppError('Password không hợp lệ', 400);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError('Sai username hoặc password', 401);
    }

    const token = signToken(user._id);
    return { user, token };
  } catch (error) {
    console.error('[auth.service.js] Login error:', error);
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Không tiết lộ email tồn tại hay không
    return;
  }

  // Tạo token reset password
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút

  await user.save({ validateBeforeSave: false });

  // TODO: Gửi email chứa link reset (ở đây trả về token để test)
  return resetToken;
};

// Reset Password
export const resetPassword = async (token, newPassword) => {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = signToken(user._id);
  return { user, token: jwtToken };
};

const authService = {
  register,
  login,
  forgotPassword,
  resetPassword
};

export default authService;