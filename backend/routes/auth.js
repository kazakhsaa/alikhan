// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendTwoFactorCode } = require('../utils/mfa');
require('dotenv').config();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Добавьте проверку на наличие данных
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    // Проверьте, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Создайте нового пользователя
    const newUser = await User.create({ name, email, password });
    res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});


/**
 * @swagger
 * /auth/verify-mfa:
 *   post:
 *     summary: Верификация MFA кода
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *               code:
 *                 type: string
 *                 description: MFA код, отправленный на электронную почту
 *     responses:
 *       200:
 *         description: Успешная верификация MFA кода
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен для доступа к защищенным ресурсам
 *       400:
 *         description: Неверный или истекший код
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/verify-mfa', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user || !user.twoFactorCode || user.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: 'Неверный или истекший код' });
    }

    if (user.twoFactorCode !== code) {
      return res.status(400).json({ message: 'Неверный код' });
    }

    // Очистка MFA данных
    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    // Создание JWT токена
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Ошибка MFA:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная аутентификация, MFA код отправлен на электронную почту
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение о необходимости ввести MFA код
 *       400:
 *         description: Неверный email или пароль
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      // Валидация входящих данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Поиск пользователя
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }

      // Проверка пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
      }

      // Генерация и отправка MFA кода
      await sendTwoFactorCode(user);

      res.json({ message: 'Введите MFA код, отправленный на вашу электронную почту.' });
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Аутентификация через Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Перенаправление на страницу авторизации Google
 */
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Обработка ответа от Google после аутентификации
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Код авторизации от Google
 *     responses:
 *       302:
 *         description: Перенаправление с JWT токеном после успешной аутентификации
 *       401:
 *         description: Ошибка аутентификации
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Создание JWT токена
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/?token=${token}`);
  }
);

module.exports = router;
