import { useEffect } from 'react';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that gives
 * you the ability to add a callback function when an event is triggered on
 * an object.
 *
 * This function attaches an event listener to a target object on mount
 * and removes the listener on unmount.
 *
 * See [addEventListener()]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
 *
 * @kind function
 *
 * @param {EventTarget} target The [EventTarget]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget} to attach the listener to
 * @param {String} type The type of [Event]{@link https://developer.mozilla.org/en-US/docs/Web/Events} to listen for, e.g. 'resize', 'error', etc.
 * @param {Function} listener A callback function that is invoked when the event is triggered
 * @param  {...any} rest Any other arguments to pass to the addEventListener() function
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
