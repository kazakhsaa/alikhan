const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API для аутентификации пользователей
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *               email:
 *                 type: string
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('Запрос на регистрацию получен');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Ошибки валидации:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        console.log('Пользователь уже существует');
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log('Пользователь сохранен в базе данных');

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            console.error('Ошибка при генерации токена:', err);
            throw err;
          }
          console.log('Токен сгенерирован и отправлен клиенту');
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Ошибка сервера:', err.message);
      res.status(500).send('Server error');
    }
  }
);


/**
 * @swagger
 * /api/auth/login:
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
 *                 description: Email пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       400:
 *         description: Неверные учетные данные
 *       500:
 *         description: Внутренняя ошибка сервера
 */
/**
 * @route   POST /api/auth/login
 * @desc    Аутентификация пользователя и получение токена
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Пожалуйста, укажите действительный email').isEmail(),
    check('password', 'Пожалуйста, введите пароль').exists(),
  ],
  async (req, res) => {
    // Проверка на наличие ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Извлекаем email и пароль из тела запроса
    const { email, password } = req.body;

    try {
      // Проверяем, существует ли пользователь с таким email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Неверные учетные данные' }] });
      }

      // Сравниваем введенный пароль с хешированным паролем в базе данных
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Неверные учетные данные' }] });
      }

      // Создаем payload для JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Подписываем JWT и отправляем токен клиенту
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 }, // Токен действует 1 час
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Ошибка сервера:', err.message);
      res.status(500).send('Ошибка сервера');
    }
  }
);


module.exports = router;
