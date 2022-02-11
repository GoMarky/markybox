const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const isDev = require('./../environment-variable/is-dev');

const extractCssChunkLoader = {
  loader: ExtractCssChunks.loader,
  options: {
    publicPath: '../',
    hmr: isDev,
  },
};

module.exports = extractCssChunkLoader;
