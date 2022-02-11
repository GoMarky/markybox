const tsLoader = {
  loader: 'ts-loader',
  options: {
    appendTsSuffixTo: [/\.vue$/],
    transpileOnly: true,
    happyPackMode: true,
  },
};

module.exports = tsLoader;
