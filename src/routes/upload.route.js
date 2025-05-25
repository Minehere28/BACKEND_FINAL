// src/routes/upload.route.js
import express from 'express';
import { uploadImageToCloudinary, uploadImagesFromFolder } from '../utils/fileUpload.js';
import multer from 'multer';
import path from 'path';
import { url } from 'inspector';

const router = express.Router();

// Cấu hình multer để lưu file tạm
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Chapter1/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route để upload ảnh từ thư mục Chapter1
router.get('/upload-from-folder', async (req, res) => {
    try {
        await uploadImagesFromFolder('./Chapter1');
        res.status(200).json({ message: 'All images uploaded successfully',
        imageUrl: imageUrl,
         });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route để upload ảnh từ form
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const { userId } = req.body;  // Lấy userId từ request body
        const filePath = req.file.path;  // Đường dẫn file tạm

        // Gọi dịch vụ upload ảnh lên Cloudinary và cập nhật avatar cho user
        const result = await uploadImageToCloudinary(userId, filePath);

        // Trả về thông tin avatar của người dùng sau khi upload thành công
        res.status(200).json({
            message: 'Avatar uploaded successfully',
            user: result.user,  // Cập nhật thông tin user
            imageUrl: result.imageUrl  // URL của ảnh
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
