const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const { VueLoaderPlugin } = require('vue-loader');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const WebpackBar = require('webpackbar');
const StdEnv = require('std-env');
const IgnoreNotFoundExportPlugin = require('./config/plugins/IgnoreNotFoundExportPlugin');
const EnvironmentVariable = require('./config/environment-variable');
const MetaVariable = require('./config/meta-variable');
const modeConfig = env => require(`./config/webpack.${env}`)(env);

const showBuildParams = require('./config/helpers/show-build-params');

showBuildParams();

module.exports = ({ mode } = { mode: 'production' }) => {
  if (!mode) {
    mode = 'production';
  }

  const _path = path.resolve(__dirname, 'dist');

  const filename = EnvironmentVariable.isDev ? '[name].js' : `[name].[chunkhash].js`;
  const sourceMapFilename = EnvironmentVariable.isDev ? '[file].map' : '[file].[chunkhash].map';

  const {
    TAG_TITLE,
    APP_NAME,
    META_DESCRIPTION,
    META_THEME_COLOR,
  } = MetaVariable;

  const htmlWebpackPluginOptions = {
    title: APP_NAME,
    template: 'index.ejs',
    filename: 'index.html',
    // Минификация html
    minify: {
      caseSensitive: false,
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: false,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      keepClosingSlash: false,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
      sortAttributes: true,
      sortClassName: true,
    },
    inject: true,
    templateParameters: {
      IS_DEV: EnvironmentVariable.isDev,
      IS_PRODUCTION: EnvironmentVariable.isProduction,
      PUBLIC_PATH: EnvironmentVariable.publicPath,
      APP_VERSION: EnvironmentVariable.appVersion,
      META_THEME_COLOR,
      TAG_TITLE,
      APP_NAME,
      META_DESCRIPTION,
    },
  };

  const plugins = [
    new VueLoaderPlugin(),
  ];

  plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginOptions));

  plugins.push(
      /**
       * @see https://github.com/TypeStrong/ts-loader#transpileonly
       */
      new IgnoreNotFoundExportPlugin(),
      new webpack.ProvidePlugin({
        'process.env.BUILD_NUMBER': JSON.stringify(EnvironmentVariable.buildNumber),
        'process.env.BUILD_DATE': JSON.stringify(new Date().toString()),
        'process.env.APP_VERSION': JSON.stringify(EnvironmentVariable.appVersion),
        'process.env.PUBLIC_PATH': JSON.stringify(EnvironmentVariable.publicPath),
      }),
  );

  //#region TS
  const tsLoaders = new Set();

  const babelLoader = require('./config/loaders/babel.loader');
  const cacheTsLoader = require('./config/loaders/cache.ts.loader');
  const threadLoader = require('./config/loaders/thread.loader');
  const tsLoader = require('./config/loaders/ts.loader');

  tsLoaders.add(cacheTsLoader);
  tsLoaders.add(threadLoader);
  tsLoaders.add(babelLoader);
  tsLoaders.add(tsLoader);
  //#endregion TS

  //#region Vue
  const vueLoaders = new Set();

  const vueLoader = require('./config/loaders/vue.loader');
  const cacheVueLoader = require('./config/loaders/cache.vue.loader');

  vueLoaders.add(vueLoader);
  vueLoaders.add(cacheVueLoader);
  //#endregion Vue

  plugins.push(new ExtractCssChunks({
    // Options similar to the same options in webpackOptions.output
    // all options are optional
    // filename: JSON.stringify(EnvironmentVariable.isDev ? '[name].css' : 'css/[name].[hash].css'),
    // chunkFilename: JSON.stringify(EnvironmentVariable.isDev ? '[id].css' : 'css/[id].[hash].css'),
    ignoreOrder: true, // Enable to remove warnings about conflicting order
  }));

  let lastProgress = null;
  let lastModulesDone = 0;

  plugins.push(new WebpackBar({
    reporter: {
      // специальный обработчик для CI
      progress({ state }) {
        if (!StdEnv.minimalCLI) {
          return;
        }

        if (Array.isArray(state.details) && state.details[0]) {
          const modulesRegexp = state.details[0].match(/^\d+\/\d+/);
          if (modulesRegexp) {
            const modulesDone = modulesRegexp[0].split('/')[0];
            if (modulesDone - lastModulesDone > 500) {
              lastModulesDone = modulesDone;
              process.stderr.write(state.message + ', ' + state.details.join(', ') + '. ' + 'Free Memory: ' + (Math.round(os.freemem() / 1024 / 1024)) + 'MB' + '\n');
            }
          }
        }

        if (lastProgress !== state.progress && state.progress % 5 === 0) {
          const details = state.details.join(', ');
          process.stderr.write(state.progress + '%: ' + details + '\n');
          lastProgress = state.progress;
        }
      },
    },
  }));

  //#region CSS
  const cssLoaders = new Set();

  const styleLoader = require('./config/loaders/style.loader');
  const extractCssChunkLoader = require('./config/loaders/extract-css-chunk.loader');
  const cssLoader = require('./config/loaders/css.loader');

  cssLoaders.add(styleLoader);
  cssLoaders.add(extractCssChunkLoader);
  cssLoaders.add(cssLoader);
  //#endregion CSS

  return webpackMerge({
        entry: path.resolve(__dirname, 'src/main.ts'),
        output: {
          filename,
          sourceMapFilename,
          path: _path,
          publicPath: EnvironmentVariable.publicPath,
          chunkLoadTimeout: 30000,
        },
        mode,
        devtool: 'source-map',
        performance: {
          hints: false,
        },
        stats: {
          assets: EnvironmentVariable.isDev ? false : true,
          children: false,
          env: true,
          modules: false,
          entrypoints: EnvironmentVariable.isDev ? false : true,
          version: EnvironmentVariable.isDev ? false : true,
          timings: EnvironmentVariable.isDev ? false : true,
          builtAt: EnvironmentVariable.isDev ? false : true,
        },
        module: {
          rules: [
            {
              test: /\.vue$/,
              use: Array.from(vueLoaders.values()),
            },
            {
              test: /\.tsx?$/,
              use: Array.from(tsLoaders.values()),
            },
            {
              test: /\.html$/,
              use: 'vue-html-loader',
            },
            {
              test: /\.css$/,
              use: Array.from(cssLoaders),
            },
            {
              test: /\.sass$/,
              use: [
                'vue-style-loader',
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    sassOptions: {
                      indentedSyntax: true,
                    }
                  }
                }
              ]
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              use: {
                loader: 'url-loader',
                options: {
                  // Иначе url-loader делает преобразования в base64
                  limit: 1,
                  name: 'images/[name]--[folder].[ext]',
                },
              },
            },
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'media/[name]--[folder].[ext]',
              },
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              use: {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'fonts/[name]--[folder].[ext]',
                },
              },
            },
          ],
        },
        resolve: {
          alias: {
            '@': path.join(__dirname, 'src'),
          },
          fallback: {
            url: require.resolve('url'),
          },
          extensions: ['.tsx', '.ts', '.js', '.vue'],
        },
        plugins,
      },
      modeConfig(mode),
  );
};
