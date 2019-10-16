import React, { useCallback, useMemo } from 'react';

import FilterDefault from './filterDefault';
import Swatch from '../../ProductOptions/swatch';

const FilterItem = props => {
    const { filterApi, filterState, id, isSwatch, title, value } = props;
    const { toggleItem } = filterApi;
    const Tile = isSwatch ? Swatch : FilterDefault;

    // create and memoize an item to be held in state
    const eventItem = useMemo(() => ({ title, value }), [title, value]);

    // create and memoize an item that matches the tile interface
    const tileItem = useMemo(
        () => ({
            label: title,
            value_index: value
        }),
        [title, value]
    );

    // ensure item doesn't change across renders
    const handleClick = useCallback(() => {
        toggleItem({ group: id, item: eventItem });
    }, [eventItem, id, toggleItem]);

    const isSelected = filterState && filterState.has(eventItem);

    return (
        <Tile
            isSelected={isSelected}
            item={tileItem}
            onClick={handleClick}
            title={title}
            value={value}
        />
    );
};

export default FilterItem;
