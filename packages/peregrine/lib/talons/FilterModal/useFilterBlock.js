import { useCallback, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useFilterBlock = props => {
    const { filterState, items, initialOpen, group } = props;
    const location = useLocation();

    const hasSelected = useMemo(() => {
        const params = new URLSearchParams(location.search);
        //expansion of price filter dropdown
        if (group == 'price') {
            return params.get('price[filter]') ? true : false;
        }
        return items.some(item => {
            return filterState && filterState.has(item);
        });
    }, [filterState, items, group, location.search]);

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
