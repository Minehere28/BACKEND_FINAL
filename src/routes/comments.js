const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getComments,
  addComment
} = require('../controllers/comments');

const router = express.Router();

router
  .route('/:taskId/comments')
  .get(protect, getComments)
  .post(protect, addComment);

module.exports = router;