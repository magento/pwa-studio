export default fixedObserver;
/**
 * Create an observer-type generator that yields a fixed number of values.
 *
 * @param {number} length
 * @returns {Iterator}
 */
declare function fixedObserver(length: number): Iterator<any, any, undefined>;
