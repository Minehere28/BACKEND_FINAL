import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getComments, addComment } from '../controllers/comments.controller.js';

const router = express.Router();

router
  .route('/:taskId/comments')
  .get(protect, getComments)
  .post(protect, addComment);

export default router;