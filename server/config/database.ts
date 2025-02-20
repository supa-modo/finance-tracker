import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10, // Maximum connections
    min: 2, // Minimum connections
    acquire: 30000, // Timeout before error
    idle: 10000, // Disconnect idle connections
  },
});

export default sequelize;
