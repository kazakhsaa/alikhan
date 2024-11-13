const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Получаем токен из заголовка
  const token = req.header('Authorization');

  // Проверяем наличие токена
  if (!token) {
    return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Убираем префикс 'Bearer ', если он есть
    const actualToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token;

    // Верифицируем токен
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Добавляем информацию о пользователе в объект запроса
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Неверный токен' });
  }
};
