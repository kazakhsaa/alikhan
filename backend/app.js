// app.js
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const csrfProtection = require('./middleware/csrfProtection');
const passport = require('passport');
const session = require('express-session');
const sequelize = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();

// Подключение к базе данных
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено успешно.');
  })
  .catch(err => {
    console.error('Не удалось подключиться к базе данных:', err);
  });


sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Модели синхронизированы с базой данных.');
  })
  .catch(err => {
    console.error('Ошибка синхронизации моделей:', err);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:5001'],
    credentials: true,
  })
);
app.use(morgan('combined'));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(apiLimiter);

// Инициализация сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Инициализация Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Настройка Passport.js для OAuth2
require('./config/passport')(passport);

// CSRF защита
app.use(csrfProtection);

// Настройка Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Конфигурация Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Документация API',
      version: '1.0.0',
      description: 'Описание вашего API',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
  },
  apis: ['./routes/*.js'], // Путь к файлам с описанием ваших эндпоинтов
};

// Инициализация Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
