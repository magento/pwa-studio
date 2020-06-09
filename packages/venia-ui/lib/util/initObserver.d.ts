export default initObserver;
/**
 * Modify a generator function to immediately call `next()` on iterators it
 * returns. This initialization step is necessary for observer-type generators.
 *
 * @param {GeneratorFunction} fn
 * @returns {function}
 */
declare function initObserver(fn: GeneratorFunction): Function;
