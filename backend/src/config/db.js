require('dotenv').config();
const { Sequelize } = require('sequelize');

const useSSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {}
});

module.exports = sequelize;