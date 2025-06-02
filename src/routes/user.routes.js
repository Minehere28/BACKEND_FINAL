import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';  // import đúng hàm protect

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.patch('/me', protect, userController.updateMe);

export default router;
