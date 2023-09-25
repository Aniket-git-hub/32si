export default {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
