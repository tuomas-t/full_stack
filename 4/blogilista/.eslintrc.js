module.exports = {
  "env": {
    "es2021": true,
    "node": true,
    "commonjs": true,
    'jest': true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 13
  },
  "rules": {
    "indent": ["error", 2],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ]
  }
};