const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ваше API',
      version: '1.0.0',
      description: 'Документация вашего API с использованием Swagger',
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    servers: [
      {
        url: 'http://localhost:5001', // Укажите URL вашего сервера
      },
    ],
  },
  apis: ['./routes/*.js'], // Пути к файлам с вашими API-эндпоинтами
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
