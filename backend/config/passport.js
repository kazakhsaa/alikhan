// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Поиск пользователя по Google ID
          let user = await User.findOne({ where: { googleId: profile.id } });

          if (user) {
            return done(null, user);
          } else {
            // Создание нового пользователя
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              password: null, // Пароль не требуется
            });
            return done(null, user);
          }
        } catch (err) {
          console.error('Ошибка аутентификации через Google:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
