import cloudinary from '../config/cloudinary.js';
import AppError from './appError.js';
import fs from 'fs/promises';
import path from 'path';

// Upload 1 ảnh lên Cloudinary
const uploadImageToCloudinary = async (userId, filePath) => {
  try {
    if (!filePath) throw new AppError('Không có file ảnh để upload', 400);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'task-management',
      resource_type: 'image',
    });

    // Xoá file sau khi upload
    await fs.unlink(filePath);

    return {
      imageUrl: result.secure_url,
      user: { id: userId, avatar: result.secure_url },
    };
  } catch (err) {
    throw new AppError(`Lỗi khi tải ảnh lên Cloudinary: ${err.message}`, 500);
  }
};

// Upload tất cả ảnh từ một thư mục
const uploadImagesFromFolder = async (folderPath) => {
  try {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter((file) =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(path.extname(file).toLowerCase())
    );

    for (const file of imageFiles) {
      const filePath = path.join(folderPath, file);
      await cloudinary.uploader.upload(filePath, {
        folder: 'task-management/batch',
        resource_type: 'image',
      });

      // Tuỳ bạn có muốn xoá file tạm không:
      // await fs.unlink(filePath);
    }
  } catch (err) {
    throw new AppError(`Lỗi khi upload folder: ${err.message}`, 500);
  }
};

export { uploadImageToCloudinary, uploadImagesFromFolder };
