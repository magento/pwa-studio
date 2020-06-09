/**
 * This function builds an {error, id, loc} tuple from errors. It aids in
 * production-mode debugging by providing a unique ID to each error, plus a
 * hint as to the error source location, for a user to report on a support
 * call.
 * @param {Error} error The error to create or retrieve a record for.
 * @param {Window} window Window object, as an argument for testability.
 * @param {Object} context Context codesite to help make useful stacktraces.
 * @param {Object} customStack React custom stack trace for render errors.
 */
export default function errorRecord(error: Error, window: Window, context: any, customStack: any): any;
