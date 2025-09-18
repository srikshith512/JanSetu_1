const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mime = require('mime-types');

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeExt = mime.extension(file.mimetype) || 'bin';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${safeExt}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and audio
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and audio files are allowed'));
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB per file

const upload = multer({ storage, fileFilter, limits });

module.exports = { upload };
