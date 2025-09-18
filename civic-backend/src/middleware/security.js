const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');

function useSecurity(app) {
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Sanitize request data
  // Note: express-mongo-sanitize and xss-clean are incompatible with Express 5 (req.query is read-only).
  // Since we use PostgreSQL and validate inputs, omit these legacy sanitizers.
  app.use(hpp());

  // Compression
  app.use(compression());
}

module.exports = { useSecurity };
