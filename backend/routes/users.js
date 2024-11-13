// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для пользователей
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Получение текущего пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/me', auth, async (req, res) => {
  try {
    // Получаем ID пользователя из токена
    const userId = req.user.id;

    // Ищем пользователя в базе данных, исключая поле пароля
    const user = await User.findById(userId).select('-password');

    // Если пользователь не найден
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Отправляем данные пользователя в ответе
    res.json(user);
  } catch (err) {
    console.error('Ошибка сервера:', err.message);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

module.exports = router;
