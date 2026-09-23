const { Pool } = require('pg');
require('dotenv').config();

// Configuración dinámica: prioriza DATABASE_URL (usado en Render) o usa variables individuales
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT || 6543),
      ssl: {
        rejectUnauthorized: false
      }
    };

const pool = new Pool({
  ...poolConfig,
  connectionTimeoutMillis: 10000
});

module.exports = pool;