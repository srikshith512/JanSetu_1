const { Sequelize } = require('sequelize');

function makeSequelize() {
  const {
    DATABASE_URL,
    PGHOST,
    PGUSER,
    PGPASSWORD,
    PGDATABASE,
    PGPORT,
    NODE_ENV,
    DB_SSL,
    DB_SSL_REJECT_UNAUTHORIZED,
  } = process.env;

  const common = {
    dialect: 'postgres',
    logging: NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {},
  };

  const useSSL = String(DB_SSL || '').toLowerCase() === 'true';
  if (useSSL) {
    common.dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: String(DB_SSL_REJECT_UNAUTHORIZED || '').toLowerCase() === 'true',
    };
  }

  if (DATABASE_URL) {
    return new Sequelize(DATABASE_URL, common);
  }

  return new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST || 'localhost',
    port: PGPORT ? Number(PGPORT) : 5432,
    ...common,
  });
}

const sequelize = makeSequelize();

module.exports = { sequelize };
