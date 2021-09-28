import { useCallback, useMemo, useState } from 'react';

export const useFilterList = props => {
    const { filterState, items, itemCountToShow } = props;

    const hasSelected = useMemo(
        () =>
            items.some((item, index) => {
                return (
                    filterState &&
                    filterState.has(item) &&
                    index >= itemCountToShow
                );
            }),
        [filterState, itemCountToShow, items]
    );

    const [isListExpanded, setExpanded] = useState(hasSelected);

    const handleListToggle = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    return {
        handleListToggle,
        isListExpanded
    };
};
