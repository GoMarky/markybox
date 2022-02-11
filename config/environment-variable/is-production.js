const NODE_ENV = require('./node-env');

const IS_PRODUCTION = NODE_ENV === 'production';

module.exports = IS_PRODUCTION;
