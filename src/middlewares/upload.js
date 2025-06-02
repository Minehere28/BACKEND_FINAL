import multer from 'multer';
import AppError from '../utils/appError.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Xác định đường dẫn thư mục "uploads"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../tmp/uploads');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu file vào ổ đĩa tạm thời
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// Chỉ cho phép upload file ảnh
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Vui lòng chỉ tải lên hình ảnh!', 400), false);
  }
};

// Khởi tạo multer upload instance
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Export middleware upload single image
export const uploadImage = upload.single('image');
