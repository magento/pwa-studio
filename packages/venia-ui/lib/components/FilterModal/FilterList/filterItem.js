import React, { useCallback, useMemo } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';

import FilterDefault from './filterDefault';

const FilterItem = props => {
    const { filterApi, filterState, group, item, isExpanded, onApply } = props;
    const { toggleItem } = filterApi;
    const { title, value } = item;
    const isSelected = filterState && filterState.has(item);

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

        if (typeof onApply === 'function') {
            onApply(group, item);
        }
    }, [group, item, toggleItem, onApply]);

    return (
        <FilterDefault
            isSelected={isSelected}
            isExpanded={isExpanded}
            item={tileItem}
            onClick={handleClick}
            title={title}
            value={value}
        />
    );
};

FilterItem.defaultProps = {
    onChange: null
};

FilterItem.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired
    }).isRequired,
    onChange: func
};

export default FilterItem;
