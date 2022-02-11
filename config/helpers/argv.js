const minimist = require('minimist');

/**
 * Получаем аргументы из командой строки
 *
 * @type {*|minimist.ParsedArgs}
 */
const argv = minimist(process.argv.slice(2));

module.exports = argv;
