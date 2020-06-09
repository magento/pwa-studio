export default withLogger;
/**
 * Logs action type, payload, and result state to the browser console.
 * @param {*} reducer a reducing function to wrap with logging
 * @returns {Function} a wrapped reducer function
 */
declare function withLogger(reducer: any): Function;
