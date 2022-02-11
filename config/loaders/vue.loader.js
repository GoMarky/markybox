const vueLoader = {
  loader: 'vue-loader',
  options: {
    exclude: /node_modules/,
    compilerOptions: {
      whitespace: 'condense',
    },
  },
};

module.exports = vueLoader;
