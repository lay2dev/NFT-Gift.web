module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'import/no-unresolved': 'off',
    'no-callback-literal': 0,
    semi: 'off',
    'max-len': ['error', { ignoreStrings: true, ignoreComments: true }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {},
    },
  ],
}
