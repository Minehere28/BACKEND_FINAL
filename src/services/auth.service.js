import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import Team from '../models/team.js';

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

    // Kiểm tra teamId có hợp lệ không
    if (userData.teamId) {
      const existingTeam = await Team.findById(userData.teamId);
      if (!existingTeam) {
        throw new AppError('Team không tồn tại', 400);
      }
    }

    const newUser = await User.create(userData);
    console.log('[auth.service.js] New user created:', newUser);

    const token = signToken(newUser._id);
    return { user: newUser, token };
  } catch (error) {
    console.error('[auth.service.js] Register error:', error);

    // ✅ Bắt lỗi trùng username (duplicate key error)
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

const authService = {
  register,
  login,
};

export default authService;
