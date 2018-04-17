/**
 * Modify a generator function to immediately call `next()` on iterators it
 * returns. This initialization step is necessary for observer-type generators.
 *
 * @param {GeneratorFunction} fn
 * @returns {function}
 */
const initObserver = fn => (...args) => {
    const obj = fn(...args);
    obj.next();
    return obj;
};

export default initObserver;
