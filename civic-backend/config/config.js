require('dotenv').config();

const useUrl = !!process.env.DATABASE_URL;

function buildDialectOptions() {
  const useSSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';
  if (!useSSL) return {};
  return {
    ssl: {
      require: true,
      rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || '').toLowerCase() === 'true',
    },
  };
}

module.exports = {
  development: useUrl
    ? {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: buildDialectOptions(),
        logging: console.log,
      }
    : {
        username: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'jan_setu',
        host: process.env.PGHOST || '127.0.0.1',
        port: Number(process.env.PGPORT || 5432),
        dialect: 'postgres',
        dialectOptions: buildDialectOptions(),
      },
  test: {
    storage: ':memory:',
    dialect: 'sqlite',
    logging: false,
  },
  production: useUrl
    ? {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: buildDialectOptions(),
        logging: false,
      }
    : {
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 5432),
        dialect: 'postgres',
        dialectOptions: buildDialectOptions(),
        logging: false,
      },
};
