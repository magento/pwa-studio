import BrowserPersistence from '../../util/simplePersistence';
import userActions, { signOut } from '../actions/user';

const timers = new Map();
const { KEY } = BrowserPersistence;
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
        const item = localStorage.getItem(`${KEY}__signin_token`);

        // exit if there's nothing in storage
        if (!item) return next(action);

        const { timeStored, ttl, value } = JSON.parse(item);
        const parsedValue = JSON.parse(value);
        const elapsed = Date.now() - timeStored;
        const delay = Math.min(ttl * 1000 - elapsed, 0);

        // only set one timer per token
        if (!timers.has(parsedValue)) {
            const timeoutId = setTimeout(() => {
                timers.delete(parsedValue);
                // clear token and customer state
                dispatch(signOut()).then(() => {
                    // refresh the page, important for checkout
                    history.go(0);
                });
            }, delay);

            timers.set(parsedValue, timeoutId);
        }
    } else if (isSigningOut(action.type)) {
        // clear any lingering timers when a user signs out
        for (const timeoutId of timers) {
            clearTimeout(timeoutId);
        }

        timers.clear();
    }

    return next(action);
};

export default scheduleSignOut;
