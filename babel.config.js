const EnvironmentVariable = require('./config/environment-variable');
const isTargetModernBuild = EnvironmentVariable.isTest;

const plugins = [
  '@babel/plugin-syntax-dynamic-import',
  [
    'const-enum',
    {
      transform: 'constObject',
    },
  ],
  ['@babel/plugin-proposal-class-properties'],
  ['@babel/plugin-transform-classes', { spec: true }],
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: false,
      // move helpers into separate file
      helpers: true,
      regenerator: false,
      useESModules: true,
    },
  ],
];

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: '^3.6.5',
        exclude: ['transform-async-to-generator', 'transform-regenerator'],
        targets: isTargetModernBuild ? { esmodules: true } : undefined,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins,
};
