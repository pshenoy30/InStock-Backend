// knex.js
// Import dotenv to process environment variables from `.env` file.
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};

export default dbConfig;
