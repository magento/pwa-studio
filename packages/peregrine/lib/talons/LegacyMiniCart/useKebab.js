import { useCallback, useRef, useState } from 'react';
import { useEventListener } from '@magento/peregrine';

// TODO: Compare with `useDropdown` and consolidate if possible.
export const useKebab = () => {
    const kebabRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleKebabClick = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const handleOutsideKebabClick = useCallback(event => {
        // Ensure we're truly outside of the kebab.
        if (!kebabRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEventListener(document, 'mousedown', handleOutsideKebabClick);
    useEventListener(document, 'touchend', handleOutsideKebabClick);

    return {
        handleKebabClick,
        isOpen,
        kebabRef
    };
};
