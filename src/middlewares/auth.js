import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.js';

// Middleware xác thực người dùng
const protect = async (req, res, next) => {
  try {
    // 1) Lấy token từ header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.', 401));
    }

    // 2) Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Kiểm tra user có tồn tại không
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('Người dùng không tồn tại.', 401));
    }

    // 4) Gán user vào request
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware phân quyền Admin
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return next(new AppError('Bạn không có quyền thực hiện hành động này!', 403));
  }
  next();
};

// Xuất các middleware
export { protect, restrictToAdmin };
