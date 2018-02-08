/**
 * Retrieve a single exported binding from a module.
 *
 * @param {object} obj - A module's namespace object
 * @param {string} name - The binding to retrieve
 * @returns {Promise<*>}
 */
export const extract = (obj, name = 'default') =>
    Promise.resolve(obj).then(mod => {
        if (!mod || typeof mod !== 'object') {
            throw new Error('Invalid namespace object provided.');
        }

        if (!mod.hasOwnProperty(name)) {
            throw new Error(`Binding ${name} not found.`);
        }

        return mod[name];
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
