// import express from 'express';
// import AuthController from './auth.controller.js';

// const authRoute = express.Router();

// authRoute.post('/register', AuthController.register);
// authRoute.post('/example', AuthController.example);

// export default authRoute;

import express from 'express';
import { forgotPassword, resetPassword } from './auth.controller.js';

const router = express.Router();


// Định nghĩa 2 endpoint API
router.post('/forgot-password', forgotPassword);  // Xử lý yêu cầu quên mật khẩu
router.post('/reset-password', resetPassword);    // Xử lý đặt lại mật khẩu

// module.exports = router;  // Export router để sử dụng ở file khác
export default router;
