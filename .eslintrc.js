const OFF = 'off';

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  plugins: ['import'],
  extends: [
    'airbnb-base',
    'plugin:sonarjs/recommended',
  ],
  overrides: [
    {
      files: ['src/helpers/handlers.js'],
      rules: {
        'import/no-dynamic-require': OFF,
        'global-require': OFF,
      },
    },
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
};
