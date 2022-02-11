const os = require( 'os' );

const platform = os.platform();
const host = platform === 'win32' ? '127.0.0.1' : '0.0.0.0';

module.exports = (env) => ({
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    writeToDisk: true,
    hot: true,
    disableHostCheck: true,
    host,
    open: true,
    overlay: {
      errors: true,
    },
    logLevel: 'warn',
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
