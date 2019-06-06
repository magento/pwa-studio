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
    // TODO: There is a bug where array properties of `action.payload` are
    // logged as empty even though they aren't and the state is updated with
    // incoming values (although that is dependent on the action). Probably
    // related to Chrome logging a reference to the array and some code clearing
    // the array at some point.
    console.log(action.payload);
    console.groupEnd();
    console.group('next state');
    console.log(store.getState());
    console.groupEnd();
    console.groupEnd();
    return result;
};

export default log;
