module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 4,
      },
    },
  ],
};
