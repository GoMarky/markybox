const NODE_ENV = require('./node-env');
const IS_TEST = NODE_ENV === 'test';

module.exports = IS_TEST;

