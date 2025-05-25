const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadBackground
} = require('../controllers/subBoards');
const upload = require('../utils/fileUpload');

const router = express.Router();

router
  .route('/:id/background')
  .put(protect, authorize('Admin'), upload.single('file'), uploadBackground);

module.exports = router;