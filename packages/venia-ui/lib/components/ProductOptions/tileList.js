import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Tile from './tile';

import { useStyle } from '../../classify';
import defaultClasses from './tileList.css';

const TileList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionChange } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                return (
                    <Tile
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={onSelectionChange}
                    />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionChange]
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
