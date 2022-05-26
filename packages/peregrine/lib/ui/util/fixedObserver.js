/**
 * Create an observer-type generator that yields a fixed number of values.
 *
 * @param {number} length
 * @returns {Iterator}
 */
const fixedObserver = function*(length) {
    for (let i = 0; i < length; i++) {
        yield;
    }

    return;
};

export default fixedObserver;
