/**
 * Добавляет начальный '/', если его нет.
 *
 * @example ensureStartSlash('abc') -> '/abc'
 * @example ensureStartSlash('/abc') -> '/abc'
 * @param {string} path
 * @returns {string}
 */
function ensureStartSlash(path) {
  if (!(path instanceof String) && (typeof path !== 'string')) {
    throw new Error('Path must be type of string');
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `/${path}`;
}

module.exports = {
  ensureStartSlash,
}


/**
 * Добавляет конечный '/', если его нет.
 *
 * @example ensureStartSlash('abc') -> 'abc/'
 * @example ensureStartSlash('abc/') -> 'abc/'
 * @param {string} path
 * @returns {string}
 */
function ensureEndSlash(path) {
  if (!(path instanceof String) && (typeof path !== 'string')) {
    throw new Error('Path must be type of string');
  }

  if (path.endsWith('/')) {
    return path;
  }

  return `${path}/`;
}

/**
 * Генерация publicPath для webpack
 *
 * @example createPublicPath('abc') -> '//origin.bkfon-resources.com/abc/'
 * @param {string | undefined} staticDir — директория, где будет лежать статика на CDN
 */
function createPublicPath(staticDir) {
  if (!staticDir) {
    return '';
  }

  const correctStaticDir = ensureEndSlash(ensureStartSlash(staticDir));

  return correctStaticDir;
}

module.exports = {
  createPublicPath,
}
