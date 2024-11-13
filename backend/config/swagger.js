// config/swagger.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// Настройки Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Версия OpenAPI
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Документация вашего API',
    },
    servers: [
      {
        url: 'http://localhost:5001', // Адрес вашего сервера
      },
    ],
  },
  apis: ['./routes/*.js'], // Путь к файлам с описанием ваших эндпоинтов
};

// Инициализация Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ваши маршруты и остальной код
// ...

// Запуск сервера
app.listen(5001, () => {
  console.log('Сервер запущен на http://localhost:5001');
});
