module.exports = {
    // ...
    parserOptions: {
      ecmaVersion: 2020,
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      // другие настройки
    ],
    rules: {
      'no-undef': 'off', // Отключить правило, если необходимо
      'vue/multi-word-component-names': 'off',
      // другие правила
    },
  };
  