const argv = require('./../helpers/argv');
const appVersion = require('./app-version');
const publicPath = require('./public-path');
const buildNumber = require('./build-number');
const isDev = require('./is-dev.js');
const isProduction = require('./is-production');
const nodeEnv = require('./node-env');
const nodeVersion = require('./node-version');
const isTest = require('./is-test');

module.exports = {
  nodeEnv,
  nodeVersion,
  argv,
  appVersion,
  publicPath,
  buildNumber,
  isDev,
  isTest,
  isProduction,
}
