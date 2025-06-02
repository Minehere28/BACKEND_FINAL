import express from 'express';
import * as subBoardController from '../controllers/subBoard.controller.js';
import * as authMiddleware from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';

const router = express.Router();

router.use(authMiddleware.protect); 

router.post(
  '/tasks/:taskId/subboards',
  authMiddleware.restrictToAdmin,
  subBoardController.createSubBoard
);

router
  .route('/:id')
  .patch(authMiddleware.restrictToAdmin, subBoardController.updateSubBoard)
  .delete(authMiddleware.restrictToAdmin, subBoardController.deleteSubBoard);

router.post('/:id/upload-bg', uploadImage, subBoardController.uploadBackground);

export default router;

// import express from 'express';
// import * as subBoardController from '../controllers/subBoard.controller.js';
// // import * as authMiddleware from '../middlewares/auth.js';
// import { uploadImage } from '../middlewares/upload.js';

// const router = express.Router();

// // router.use(authMiddleware.protect); // 🚫 Tạm thời comment để test

// router.post(
//   '/tasks/:taskId/subboards',
//   // authMiddleware.restrictToAdmin, // 🚫 Comment để tránh bị treo
//   subBoardController.createSubBoard
// );

// router
//   .route('/:id')
//   .patch(
//     // authMiddleware.restrictToAdmin, // 🚫 Comment
//     subBoardController.updateSubBoard
//   )
//   .delete(
//     // authMiddleware.restrictToAdmin, // 🚫 Comment
//     subBoardController.deleteSubBoard
//   );

// router.post('/:id/upload-bg', uploadImage, subBoardController.uploadBackground);

// export default router;
