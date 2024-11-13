// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    twoFactorCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      field: 'two_factor_code',
    },
    twoFactorExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'two_factor_expires',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: sequelize.literal('NOW()'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: sequelize.literal('NOW()'),
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
