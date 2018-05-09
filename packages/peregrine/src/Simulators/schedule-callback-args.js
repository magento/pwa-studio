import { inspect } from 'util';

/**
 * @typedef {Object} UpdateEvent
 * @property {Number} elapsed - Milliseconds after the `scheduleCallbackArgs()`
 *     call to invoke the callback. `0` will invoke immediately. The same
 *     number twice will invoke twice at the same (rough) time, but in two
 *     different turns of the event loop.
 *     Each `elapsed` value represents time elapsed from the initial call,
 *     not the time between subsequent calls. So if you want to call the
 *     callback three times, with a 1-second gap before each time, your
 *     schedule would be:
 *     [
 *       { elapsed: 1000, args: args },
 *       { elapsed: 2000, args: args },
 *       { elapsed: 3000, args: args }
 *     ]
 *
 * @property {*[]|Function} args - Array of values to use as function
 *     arguments at the appointed time. Can also be a function that returns
 *     such an array.
 */

/**
 * Turn any value until a function returning that value.
 * Args props can take arrays, or array-returning functions.
 * Implementations assume array-returning functions; this ensures it;
 * @private
 */
function ensureFunction(value) {
    return typeof value === 'function' ? value : () => value;
}

/**
 * Handle errors in the absence of an error handler, by not handling them.
 * @param {Error} e Error to handle (by not handling it)
 * @private
 */
function defaultErrorHandler(e) {
    throw e;
}

/**
 * @typedef {Object} Disposer
 * @property {Function} cancel - Call to cancel any pending operations on
 *     the original schedule.
 */

/**
 * A handle for a set of running timers.
 */
class TimerSchedule {
    constructor() {
        this._timers = [];
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Add a timer to the internal list.
     * @param {Number} timer Timer descriptor (a number returned from setTimeout)
     */
    add(timer) {
        this._timers.push(timer);
    }
    /**
     * Cancel all upcoming timers inside this handler. Can only be called once.
     * @returns undefined;
     */
    cancel() {
        this._timers.forEach(clearTimeout);
        this._timers = null;
        this.cancel = () => {
            throw new Error(
                `Tried to call cancel on an already canceled scheduler`
            );
        };
    }
}

/**
 * Validate one of these update events.
 * @private
 */
const badUpdateEvent = update =>
    isNaN(update.elapsed) ||
    (typeof update.args !== 'function' && !Array.isArray(update.args));

/**
 * Describe how and when to call a function over time, using an array of
 * configuration objects.
 *
 * Use to test the behavior of asynchronous listeners and components.
 *
 * Returns an object with a `.cancel()` method, which when called will
 * cancel any updates not yet executed.
 *
 * @param {UpdateEvent[]} calls List of { elapsed: number, args: any[] }
 *    objects describing the timing and arguments for executing the callback.
 * @param {Function} callback Callback to be invoked on the schedule, with the
 *    configured arguments.
 * @param {Function} errorHandler Callback to be invoked with any errors that
 * occur during delayed calls. Defaults to throwing the exception, and async
 * exceptions are hard to catch.
 *
 * @returns {TimerSchedule}
 */
export default function scheduleCallbackArgs(
    calls,
    callback,
    errorHandler = defaultErrorHandler
) {
    if (
        !Array.isArray(calls) ||
        calls.length < 1 ||
        calls.some(badUpdateEvent)
    ) {
        return errorHandler(
            Error(
                'First argument must be an array of 1 or more { elapsed: number, args: any[] } objects.'
            )
        );
    }

    if (typeof callback !== 'function') {
        return errorHandler(
            Error('Must provide a callback as the second argument.')
        );
    }

    const schedule = new TimerSchedule();

    const invoker = getArgs => () => {
        let args;
        try {
            args = getArgs();
        } catch (getArgsError) {
            errorHandler(getArgsError);
            return;
        }
        if (Array.isArray(args)) {
            try {
                return callback(...args);
            } catch (callbackError) {
                errorHandler(callbackError);
                return;
            }
        } else {
            errorHandler(
                Error(`Args callback did not return an array: ${inspect(args)}`)
            );
            return;
        }
    };

    calls.forEach(({ elapsed, args }) => {
        schedule.add(setTimeout(invoker(ensureFunction(args)), elapsed));
    });

    return schedule;
}
