import { useCallback, useState, useEffect } from 'react';

export const useFilterBlock = (
    hasSelectedElements = false,
    initiallyOpen = false
) => {
    const [isExpanded, setExpanded] = useState(
        hasSelectedElements || initiallyOpen
    );

    useEffect(() => {
        setExpanded(hasSelectedElements || initiallyOpen);
    }, [hasSelectedElements, initiallyOpen]);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleClick,
        isExpanded
    };
};
