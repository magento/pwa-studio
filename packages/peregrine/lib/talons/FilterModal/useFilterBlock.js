import { useCallback, useState } from 'react';

const getFilterType = id => (id === 'fashion_color' ? 'SWATCH' : 'DEFAULT');

export const useFilterBlock = props => {
    const { group } = props;
    const isSwatch = getFilterType(group) === 'SWATCH';
    const [isExpanded, setExpanded] = useState(false);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleClick,
        isExpanded,
        isSwatch
    };
};
