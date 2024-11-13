// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Неверный или истекший токен' });
  }
};
