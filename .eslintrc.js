module.exports = {
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
    'project': './tsconfig.json',
    'extraFileExtensions': ['.vue'],
  },
  globals: {
    process: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript',
    'plugin:@typescript-eslint/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  plugins: [
    '@gomarky/no-const-enum'
  ],
  rules: {
    'radix': ['error', 'always'],
    'eqeqeq': 2,
    'curly': 2,

    'no-prototype-builtins': 0,

    '@gomarky/no-const-enum/base': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],

    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': ['error', {
      ignoreRestArgs: true,
    }],

    '@typescript-eslint/no-floating-promises': ['error', {
      ignoreVoid: true
    }],

    '@typescript-eslint/no-require-imports': 'error',

    '@typescript-eslint/no-throw-literal': 'error',

    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        'checksVoidReturn': false
      }
    ],

    '@typescript-eslint/no-misused-new': 'error',

    '@typescript-eslint/explicit-member-accessibility': ['error', {
      accessibility: 'explicit',
      overrides: {
        accessors: 'explicit',
        constructors: 'no-public',
        methods: 'explicit',
        properties: 'explicit',
        parameterProperties: 'explicit'
      }
    }],

    '@typescript-eslint/no-non-null-assertion': 'error',

    '@typescript-eslint/await-thenable': 'error',

    '@typescript-eslint/ban-types': [
      'error', {
        'types': {
          'Foo': "Don't use Far because it is unsafe",

          'String': {
            'message': 'Use string instead',
            'fixWith': 'string'
          },

          '{}': {
            'message': 'Use object instead',
            'fixWith': 'object'
          }
        }
      }],

    '@typescript-eslint/prefer-readonly': ['error', {
      onlyInlineLambdas: false,
    }],

    '@typescript-eslint/member-ordering': ['error', {
      'default': [
        'public-static-field',
        'protected-static-field',
        'private-static-field',
        'private-instance-field',
        'protected-instance-field',
        'public-instance-field',
        'constructor',
        'public-static-method',
        'protected-static-method',
        'private-static-method',
        'public-instance-method',
        'protected-instance-method',
        'private-instance-method'
      ]
    }],

    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-use-before-define': 0,

    '@typescript-eslint/consistent-type-assertions': 0,
    '@typescript-eslint/interface-name-prefix': 'off',
  },
}
