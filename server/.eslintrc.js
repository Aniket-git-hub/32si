module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [{ files: ['*.d.ts'], rules: { '@typescript-eslint/no-explicit-any': 'off' } }],
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    // `const { password, ...rest } = user` is how fields are dropped before sending a user.
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
};
