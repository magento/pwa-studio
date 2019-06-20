import { useCallback, useRef, useState } from 'react';

import { useEventListener } from './useEventListener';

export const useDropdown = () => {
    const elementRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    // collapse on mousedown outside of this element
    const maybeCollapse = useCallback(({ target }) => {
        if (!elementRef.current.contains(target)) {
            setExpanded(false);
        }
    }, []);

    // add listener to document, as an effect
    useEventListener(document, 'mousedown', maybeCollapse);

    return {
        elementRef,
        expanded,
        setExpanded
    };
};
