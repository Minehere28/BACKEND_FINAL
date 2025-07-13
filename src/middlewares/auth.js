import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.js';

// Middleware xác thực người dùng
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('Người dùng không tồn tại.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware phân quyền Admin
 const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Chỉ admin mới được phép thực hiện.' });
};

// Xuất các middleware
export { protect, isAdmin };
