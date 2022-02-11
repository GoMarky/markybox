const argv = require('./../helpers/argv');

// Current build number (need for demo.constantadev.tech)
const buildNumber = argv.buildNumber || '';

module.exports = buildNumber;
