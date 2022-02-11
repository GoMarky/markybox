/**
 * Версию приложения берем из package.json
 */
const { version: appVersion } = require('./../../package.json');

module.exports = appVersion;
