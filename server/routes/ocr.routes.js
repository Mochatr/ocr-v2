import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { processImage, getProcessingHistory } from '../controllers/ocr.controller.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/process', protect, upload.single('image'), processImage);
router.get('/history', protect, getProcessingHistory);

export default router;