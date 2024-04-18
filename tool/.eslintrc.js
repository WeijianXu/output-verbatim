module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['../.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
