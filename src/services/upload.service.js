// src/services/upload.service.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import User from '../models/users.model.js';

// Cấu hình Cloudinary từ biến môi trường
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
});

export const uploadImageToCloudinary = async (userId, filePath) => {
    try {
        // Upload ảnh lên Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'user_avatars',
            resource_type: 'image'
        });

        // Cập nhật thông tin avatar cho user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatar: {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                }
            },
            { new: true }
        );
        if (!updatedUser) {
            throw new Error("User not found");
        }

        // Xóa file tạm sau khi upload
        fs.unlinkSync(filePath);

        return {
            user: updatedUser,
            imageUrl: uploadResult.secure_url
        };
        
    } catch (error) {
        // Xóa file tạm nếu có lỗi
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};

export const uploadImagesFromFolder = async (folderPath) => {
    try {
        // Lấy danh sách file ảnh trong thư mục
        const files = fs.readdirSync(folderPath).filter(file => 
            file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
        );

        console.log(`🔍 Found ${files.length} images in directory.`);

        // Upload từng ảnh (ví dụ này chỉ minh họa, bạn cần xác định userId tương ứng)
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            console.log(`📤 Uploading: ${file} ...`);

            try {
                // Trong thực tế, bạn cần xác định userId tương ứng với mỗi ảnh
                // Đây chỉ là ví dụ, bạn cần điều chỉnh theo logic của bạn
                const userId = 'someUserId'; // Thay bằng userId thực tế
                
                const result = await uploadImageToCloudinary(userId, filePath);
                console.log(`✅ Upload successful: ${file}`);
                console.log("🔗 URL:", result.imageUrl);
            } catch (uploadError) {
                console.error(`❌ Error uploading ${file}:`, uploadError);
            }
        }

        console.log("🎉 All images uploaded successfully!");
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};