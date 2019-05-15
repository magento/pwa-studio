import { useCallback, useRef, useState } from 'react';

import { useDocumentListener } from './useDocumentListener';

/**
 * A React Hook for adding dropdown-related logic.
 *
 * [ref]: https://reactjs.org/docs/refs-and-the-dom.html
 * [state hook]: https://reactjs.org/docs/hooks-state.html
 *
 * @return {Object} An object containing functions and values to add dropdown logic
 */
export const useDropdown = () => {
    const elementRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    // collapse on mousedown outside of this element
    const maybeCollapse = useCallback(
        ({ target }) => {
            if (!elementRef.current.contains(target)) {
                setExpanded(false);
            }
        },
        [elementRef.current]
    );

    // add listener to document, as an effect
    useDocumentListener('mousedown', maybeCollapse);

    /**
     * @typedef ReturnedObject
     * @type {Object}
     * @property {Object} elementRef - A [ref][] object for attaching to React elements
     * @property {bool} expanded - The value of the `expanded` state
     * @property {function} setExpanded - [State Hook][] function for setting the expanded state
     */
    return {
        elementRef,
        expanded,
        setExpanded
    };
};
