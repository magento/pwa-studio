import { useCallback, useState, useEffect, useMemo } from 'react';

export const useFilterBlock = props => {
    const { filterState, items, initialOpen } = props;

    const hasSelected = useMemo(() => {
        return items.some(item => {
            return filterState && filterState.has(item);
        });
    }, [filterState, items]);

    const [isExpanded, setExpanded] = useState(hasSelected || initialOpen);

    useEffect(() => {
        setExpanded(hasSelected || initialOpen);
    }, [hasSelected, initialOpen]);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleClick,
        isExpanded
    };
};
