export default log;
/**
 * Log actions and state to the browser console.
 * This function adheres to Redux's middleware pattern.
 *
 * @param {Store} store The store to augment.
 * @returns {Function}
 */
declare function log(store: any): Function;
