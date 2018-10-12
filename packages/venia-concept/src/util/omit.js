/**
 * Return a copy of an object with one named property omitted.
 * Short version of lodash.omit.
 *
 * Useful when a reducer needs to drop something from state, without using
 * the `delete` keyword to mutate the existing state. The `delete` keyword
 * is also a deopt.
 *
 * @param {object} obj -- Object to copy
 * @param {string} omitKey -- Property name to omit
 * @returns {object} Copy of the object with the specified key omitted.
 *
 * @example
 *
 * ```js
 * const musketeers = {
 *   athos: true,
 *   porthos: true,
 *   aramis: true
 * };
 *
 * console.lot(omit(musketeers, 'athos'));
 *
 * {
 *   porthos: true,
 *   aramis: true
 * }
 */

module.exports = (obj, omitKey) =>
    Object.entries(obj).reduce(
        (out, [key, value]) =>
            key === omitKey ? out : ((out[key] = value), out),
        {}
    );
