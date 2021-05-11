import React, { useCallback, useMemo } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';

import FilterDefault from './filterDefault';

const FilterItem = props => {
    const {
        filterApi,
        filterState,
        group,
        item,
        isExpanded,
        handleApply
    } = props;
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

        if (typeof handleApply === 'function') {
            handleApply(group, item);
        }
    }, [group, item, toggleItem, handleApply]);

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
    handleApply: null
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
    handleApply: func
};

export default FilterItem;
