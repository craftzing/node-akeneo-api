module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig-lint.json',
  },
  plugins: ['@typescript-eslint', 'jest', 'import'],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/namespace': 'off',
    'import/extensions': 'off',
    camelcase: 'off',
  },
};
