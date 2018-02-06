/**
 * Extract a single export from a module.
 *
 * @param {object} obj - A module's namespace object
 * @param {string} name - The key to look up
 */
export const extract = (obj, name = 'default') =>
    Promise.resolve(obj)
        .then(mod => mod[name])
        .catch(() => {
            throw new Error(`Object is not a valid module.`);
        });

/**
 * Create an observer-type generator that yields a fixed number of values.
 *
 * @param {number} length
 * @returns {Iterator}
 */
export const fixedObserver = function*(length) {
    for (let i = 0; i < length; i++) {
        yield;
    }

    return;
};

/**
 * Modify a generator function to immediately call `next()` on iterators it
 * returns. This initialization step is necessary for observer-type generators.
 *
 * @param {GeneratorFunction} fn
 * @returns {function}
 */
export const initObserver = fn => (...args) => {
    const obj = fn(...args);
    obj.next();
    return obj;
};
