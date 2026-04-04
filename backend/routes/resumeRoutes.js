const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  analyzeResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  },
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);
router.post('/analyze/:id', protect, analyzeResume);

module.exports = router;
