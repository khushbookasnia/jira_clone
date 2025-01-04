module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    radix: 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'consistent-return': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': ['error', 'except-parens'],
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'react/no-array-index-key': 'off',
    'react/forbid-prop-types': 'off',
    'react/prop-types': ['error', { skipUndeclared: true }],
    'react/jsx-fragments': ['error', 'element'],
    'react/state-in-constructor': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
