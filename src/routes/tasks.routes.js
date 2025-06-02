import express from 'express';
import * as taskController from '../controllers/tasks.controller.js';
import { protect, restrictToAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(restrictToAdmin, taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(restrictToAdmin, taskController.updateTask)
  .delete(restrictToAdmin, taskController.deleteTask);

export default router;
