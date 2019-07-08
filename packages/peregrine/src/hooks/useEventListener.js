import { useEffect } from 'react';

/**
 * Attaches an event listener to a target object on mount. Removes the listener
 * on unmount.
 *
 * @param {Object} target the target to attach the listener to
 * @param {String} type the type of event like 'resize', 'error', etc.
 * @param {Function} listener a callback function to be invoked
 * @param  {...any} rest any other arguments to pass to the function
 */
export const useEventListener = (target, type, listener, ...rest) => {
    useEffect(() => {
        target.addEventListener(type, listener, ...rest);

        // return a callback, which is called on unmount
        return () => {
            target.removeEventListener(type, listener, ...rest);
        };
    }, [listener, rest, target, type]);
};
