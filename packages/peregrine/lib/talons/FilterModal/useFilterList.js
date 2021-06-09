import { useCallback, useState } from 'react';

export const useFilterList = () => {
    const [isListExpanded, setExpanded] = useState(false);

    const handleListToggle = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleListToggle,
        isListExpanded
    };
};
