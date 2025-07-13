import User from '../models/user.js';
import AppError from '../utils/appError.js';


// Tạo người dùng mới (Chỉ Admin)
export const createUser = async ({ username, password, role, email }) => {
  // Kiểm tra trùng username hoặc email
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new AppError('Username hoặc email đã tồn tại', 400);
  }
  const user = await User.create({ username, password, role, email });
  user.password = undefined; // Ẩn password khi trả về
  return user;
};

// Liệt kê tất cả người dùng (phân trang, chỉ Admin)
export const getAllUsers = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select('-password -__v');
  const total = await User.countDocuments();
  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Lấy thông tin cá nhân hiện tại
export const getUserProfile = async (userId) => {
  return await User.findById(userId).select('-password -__v');
};

// Cập nhật thông tin cá nhân
export const updateUserProfile = async (userId, updateData) => {
  if (updateData.password) {
    throw new AppError('Không được cập nhật mật khẩu ở đây.', 400);
  }
  const filteredBody = {};
  if (updateData.username) filteredBody.username = updateData.username;
  if (updateData.teamId) filteredBody.teamId = updateData.teamId;

  return await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password -__v');
};

// Xóa người dùng (Chỉ Admin)
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }
  return;
};