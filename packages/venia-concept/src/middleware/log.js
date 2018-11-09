/**
 * Log actions and state to the browser console.
 * This function adheres to Redux's middleware pattern.
 *
 * @param {Store} store The store to augment.
 * @returns {Function}
 */
const log = store => next => action => {
    const result = next(action);

    console.groupCollapsed(action.type);
    console.group('payload');
    console.log(action.payload);
    console.groupEnd();
    console.group('next state');
    console.log(store.getState());
    console.groupEnd();
    console.groupEnd();

    return result;
};

export default log;
