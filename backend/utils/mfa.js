// utils/mfa.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true для 465, false для других портов
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendTwoFactorCode(user) {
  // Генерация кода
  const code = crypto.randomInt(100000, 999999).toString();

  // Сохранение кода и времени истечения
  user.twoFactorCode = code;
  user.twoFactorExpires = Date.now() + 10 * 60 * 1000; // 10 минут
  await user.save();

  // Отправка кода по электронной почте
  const mailOptions = {
    from: `"Ваше приложение" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Ваш MFA код',
    text: `Ваш код для входа: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendTwoFactorCode };
