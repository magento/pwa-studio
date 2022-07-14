import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Tile from './tile';

import { useStyle } from '../../classify';
import defaultClasses from './tileList.module.css';

const TileList = props => {
    const {
        getItemKey,
        selectedValue = {},
        items,
        onSelectionChange,
        isALLOutOfStock,
        isVariantsOutOfStock
    } = props;
    let isOptionOutOfStock;
    const classes = useStyle(defaultClasses, props.classes);

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                if (isVariantsOutOfStock && isVariantsOutOfStock.length > 0) {
                    const flatOosArray = isVariantsOutOfStock.flat();
                    isOptionOutOfStock = flatOosArray.includes(
                        item.value_index
                    );
                }

                return (
                    <Tile
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={onSelectionChange}
                        isALLOutOfStock={isALLOutOfStock}
                        isOptionOutOfStock={isOptionOutOfStock}
                    />
                );
            }),
        [
            getItemKey,
            selectedValue.label,
            items,
            onSelectionChange,
            isALLOutOfStock,
            isOptionOutOfStock
        ]
    );

    return <div className={classes.root}>{tiles}</div>;
};

TileList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    selectedValue: object,
    items: arrayOf(object),
    onSelectionChange: func
};

TileList.displayName = 'TileList';

export default TileList;
