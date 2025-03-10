module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["@/eslint-config/react.js"],
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:react-hooks/recommended',
  // ],
  // ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['react-refresh'],
  // rules: {
  //   'react-refresh/only-export-components': [
  //     'warn',
  //     { allowConstantExport: true },
  //   ],
  // },
}
