// Cache the generated error records, but let them be garbage collected.
const errorRecords = new WeakMap();
const { error: logError } = console;

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
export default function errorRecord(error, window, context, customStack) {
    const { Date, Math } = window;
    let record = errorRecords.get(error);
    if (record) {
        return record;
    }
    record = { error, loc: '' };
    const { constructor, message, name } = error;
    // Reasonably unique, yet readable error ID.
    const seconds = new Date().getSeconds();
    const randomChar = Math.random()
        .toString(36)
        .slice(2, 3)
        .toUpperCase();
    record.id =
        ((constructor && constructor.name) || name) + seconds + randomChar;

    // Add offending line, if possible.
    let stack;
    if (customStack) {
        stack = customStack;
    } else {
        /* istanbul ignore next */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(error, context);
        }
        stack = error.stack;
    }
    const messageStart = stack.indexOf(message);
    if (messageStart > -1) {
        const traceStart = messageStart + message.length;
        record.loc = stack
            .slice(traceStart)
            .replace(window.location.origin, '')
            .trim()
            .split('\n')[0];
    }
    errorRecords.set(error, record);
    // In development mode, React logs these already.
    // Log in production mode so that users can give Support helpful debug info.
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production') {
        logError(
            `%cUnhandled ${record.id}`,
            'background: #CC0000; color: white; padding: 0.1em 0.5em',
            stack
        );
    }
    return record;
}
