import { useCallback, useState } from 'react';

export const useFilterBlock = () => {
    const [isExpanded, setExpanded] = useState(false);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleClick,
        isExpanded
    };
};
