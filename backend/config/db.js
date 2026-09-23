const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const hasIndividualSettings = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;

if ((!connectionString || connectionString.includes('REGION')) && !hasIndividualSettings) {
  throw new Error('Configura DATABASE_URL o DB_HOST, DB_USER y DB_NAME en el archivo .env.');
}

const pool = new Pool({
  ...(connectionString && !connectionString.includes('REGION')
    ? { connectionString }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT || 5432)
      }),
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

module.exports = pool;