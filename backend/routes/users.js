// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Получение информации о текущем пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о текущем пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/me', auth, async (req, res) => {
  try {
    // Ищем пользователя в базе данных, исключая поле пароля
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'twoFactorCode', 'twoFactorExpires'] },
    });

    // Если пользователь не найден
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Отправляем данные пользователя в ответе
    res.json(user);
  } catch (err) {
    console.error('Ошибка сервера:', err.message);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

module.exports = router;
