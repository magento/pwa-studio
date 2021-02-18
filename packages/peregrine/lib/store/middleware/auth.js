import BrowserPersistence from '../../util/simplePersistence';
import userActions, { signOut } from '../actions/user';

const timeouts = new Map();
const intervals = new Map();
const storage = new BrowserPersistence();
const SET_TOKEN = userActions.setToken.toString();
const CLEAR_TOKEN = userActions.clearToken.toString();
const GET_DETAILS = userActions.getDetails.request.toString();

const isSigningIn = type => type === SET_TOKEN || type === GET_DETAILS;
const isSigningOut = type => type === CLEAR_TOKEN;

/**
 * This function adheres to Redux's middleware pattern.
 *
 * @param {Store} store The store to augment.
 * @returns {Function}
 */
const scheduleSignOut = store => next => action => {
    const { dispatch } = store;

    if (isSigningIn(action.type)) {
        // `BrowserPersistence.getItem()` only returns the value
        // but we need the full item with timestamp and ttl
        const item = storage.getRawItem('signin_token');

        // exit if there's nothing in storage
        if (!item) return next(action);

        const { timeStored, ttl, value } = JSON.parse(item);
        const parsedValue = JSON.parse(value);
        const preciseTTL = ttl * 1000;
        const elapsed = Date.now() - timeStored;
        const expiry = Math.max(preciseTTL - elapsed, 0);

        // establish a sign-out routine
        const callback = () => {
            dispatch(signOut()).then(() => {
                timeouts.delete(parsedValue);
                intervals.delete(parsedValue);

                // refresh the page, important for checkout
                history.go(0);
            });
        };

        // set a timeout that runs once when the token expires
        if (!timeouts.has(parsedValue)) {
            const timeoutId = setTimeout(callback, expiry);

            timeouts.set(parsedValue, timeoutId);
        }

        // then set an interval that runs once per second
        // on mobile, the timeout won't fire if the tab is inactive
        if (!intervals.has(parsedValue)) {
            const intervalId = setInterval(() => {
                const hasExpired = Date.now() - timeStored > preciseTTL;

                if (hasExpired) callback();
            }, 1000);

            intervals.set(parsedValue, intervalId);
        }
    } else if (isSigningOut(action.type)) {
        for (const timeoutId of timeouts) {
            clearTimeout(timeoutId);
        }

        for (const intervalId of intervals) {
            clearInterval(intervalId);
        }

        timeouts.clear();
        intervals.clear();
    }

    return next(action);
};

export default scheduleSignOut;
