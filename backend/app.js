const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Initialize middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5001'],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(apiLimiter);

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Подключаем CSRF защиту для остальных маршрутов (если необходимо)
const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
