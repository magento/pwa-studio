import { useCallback, useRef, useState } from 'react';

import { useEventListener } from './useEventListener';

/**
 * A React Hook for adding dropdown-related logic.
 *
 * @kind function
 *
 * @return {Dropdown} An object containing functions and values to add dropdown logic
 */
export const useDropdown = () => {
    const elementRef = useRef(null);
    const triggerRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    // collapse on mousedown outside of the element and trigger.
    const maybeCollapse = useCallback(({ target }) => {
        const isOutsideElement =
            !elementRef.current || !elementRef.current.contains(target);
        const isOutsideTrigger =
            !triggerRef.current || !triggerRef.current.contains(target);

        if (isOutsideElement && isOutsideTrigger) {
            setExpanded(false);
        }
    }, []);

    // add listener to document, as an effect
    useEventListener(document, 'mousedown', maybeCollapse);

    /**
     * The object returned contains the pieces needed to add the dropdown logic to your components
     *
     * @typedef Dropdown
     * @type {Object}
     * @property {Ref} elementRef - A [ref]{@link https://reactjs.org/docs/refs-and-the-dom.html} object for attaching to React elements
     * @property {Boolean} expanded - The value of the `expanded` state
     * @property {Function} setExpanded - [State Hook]{@link https://reactjs.org/docs/hooks-state.html} function for setting the expanded state
     * @property {Ref} triggerRef - A [ref]{@link https://reactjs.org/docs/refs-and-the-dom.html} object for attaching to React elements
     */
    return {
        elementRef,
        expanded,
        setExpanded,
        triggerRef
    };
};
