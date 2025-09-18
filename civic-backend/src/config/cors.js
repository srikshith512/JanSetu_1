const cors = require('cors');

function buildCorsOptions() {
  const allowListEnv = process.env.CORS_ALLOWED_ORIGINS || '';
  const allowList = allowListEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (allowList.length === 0 || allowList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Content-Disposition',
    ],
    exposedHeaders: ['Content-Disposition'],
  };
}

function useCors(app) {
  app.use(cors(buildCorsOptions()));
}

module.exports = { useCors };
