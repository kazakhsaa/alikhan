const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Получение информации о текущем пользователе
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
