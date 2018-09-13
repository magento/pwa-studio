import { combineReducers } from 'redux';

/**
 * Add slice methods to a store.
 * This function adheres to Redux's store enhancer pattern.
 *
 * @param {Function} createStore The store creator to enhance.
 * @returns {Function}
 */
const exposeSlices = createStore => (...args) => {
    const store = createStore(...args);
    const slices = {};

    /**
     * Add a slice to the root.
     * The store replaces the root with one containing the new slice.
     */
    const addReducer = (key, reducer) => {
        slices[key] = reducer;

        store.replaceReducer(combineReducers(slices));
    };

    return {
        ...store,
        addReducer
    };
};

export default exposeSlices;
