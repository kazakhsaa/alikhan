// config/config.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'berserk',
    password: process.env.DATABASE_PASSWORD || '190211',
    database: process.env.DATABASE_NAME || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    dialect: 'postgres'
  }
  // Добавьте другие окружения при необходимости
};

