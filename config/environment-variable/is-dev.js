const NODE_ENV = require('./node-env');

// Does build running on localhost
const IS_DEV = NODE_ENV === 'development';

module.exports = IS_DEV;
