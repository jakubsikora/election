module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/imports-first': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 80 chars lines
    'max-len': [2, {
      code: 80,
      tabWidth: 2,
      ignoreUrls: true
    }],
    // End files with \n
    'eol-last': 2,
    'no-underscore-dangle': 0,
    'consistent-return': 1,
    'no-param-reassign': 0,
    'new-cap': 0,
    'no-unused-vars': 0,
  },
  'globals': {
    'window': false,
    'localStorage': false,
    'document': false,
    'fetch': false
  }
};
