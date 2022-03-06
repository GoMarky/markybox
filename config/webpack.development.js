const os = require('os');
const platform = os.platform();
const host = platform === 'win32' ? '127.0.0.1' : 'localhost';

module.exports = (env) => ({
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    host,
    port: 8080,
    open: false,
    client: {
      logging: 'none',
    },
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: '-',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
})
