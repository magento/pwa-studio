import React, { useCallback, useMemo } from 'react';

import FilterDefault from './filterDefault';
import Swatch from '../../ProductOptions/swatch';

const FilterItem = props => {
    const { filterApi, filterState, group, isSwatch, item } = props;
    const { toggleItem } = filterApi;
    const { title, value } = item;
    const isSelected = filterState && filterState.has(item);
    const Tile = isSwatch ? Swatch : FilterDefault;

    // create and memoize an item that matches the tile interface
    const tileItem = useMemo(
        () => ({
            label: title,
            value_index: value
        }),
        [title, value]
    );

    const handleClick = useCallback(() => {
        toggleItem({ group, item });
    }, [group, item, toggleItem]);

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
