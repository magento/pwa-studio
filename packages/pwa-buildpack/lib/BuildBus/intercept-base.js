/** @ignore */
/**
 * Builtin targets are called manually from inside Buildpack code. Buildpack
 * can't rely on interceptors for all its base functionality, because it still
 * has to work in projects that don't have targets installed yet, such as newly
 * scaffolded projects.
 */

module.exports = () => {};
