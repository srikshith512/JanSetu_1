const morgan = require('morgan');

function useLogger(app) {
  const format = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
  app.use(morgan(format));
}

module.exports = { useLogger };
