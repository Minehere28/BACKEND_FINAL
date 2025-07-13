import express from 'express';
import {
  createUser,
  getAllUsers,
  getMe,
  updateMe,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, isAdmin } from '../middlewares/auth.js';  // import đúng hàm protect

const router = express.Router();

// router.get('/me', protect, userController.getMe);
// router.patch('/me', protect, userController.updateMe);

router.post('/users', protect, isAdmin, createUser);        // Chỉ Admin
router.get('/users', protect, isAdmin, getAllUsers);        // Chỉ Admin
router.delete('/users/:id', protect, isAdmin, deleteUser);  // Chỉ Admin

router.get('/users/me', protect, getMe);                    // Người dùng hiện tại
router.put('/users/me', protect, updateMe);
export default router;
