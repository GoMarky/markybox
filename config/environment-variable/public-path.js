const argv = require('./../helpers/argv');
const { createPublicPath } = require('./../helpers/helpers');

const publicPath = createPublicPath(argv.staticDir) || '';

module.exports = publicPath;
