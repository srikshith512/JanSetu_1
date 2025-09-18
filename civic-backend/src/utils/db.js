const { sequelize } = require('../config/database');

async function initDb({ sync = true } = {}) {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    if (sync) {
      const shouldAlter = process.env.NODE_ENV === 'development';
      await sequelize.sync({ alter: shouldAlter });
      console.log('Database synced' + (shouldAlter ? ' (alter)' : ''));
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
  }
}

module.exports = { initDb };
