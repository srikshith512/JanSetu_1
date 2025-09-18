require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { initDb } = require('./utils/db');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // Ensure uploads dir exists
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    await initDb({ sync: true });

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
