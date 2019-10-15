import React, { useCallback, useMemo } from 'react';

import FilterDefault from './filterDefault';
import Swatch from '../../ProductOptions/swatch';

const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');

const FilterItem = props => {
    const { dispatch, filterState, group, isSwatch, item } = props;
    const { label, value_string: value } = item;
    const Tile = isSwatch ? Swatch : FilterDefault;

    // create a plaintext version of the label
    const title = useMemo(() => stripHtml(label), [label]);

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
        dispatch({
            payload: {
                group,
                item: eventItem
            },
            type: 'toggle item'
        });
    }, [dispatch, eventItem, group]);

    const groupFilters = filterState.get(group);
    const isSelected = groupFilters && groupFilters.has(eventItem);

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
