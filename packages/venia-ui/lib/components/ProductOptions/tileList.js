import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Tile from './tile';

import { mergeClasses } from '../../classify';
import defaultClasses from './tileList.css';

const TileList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionClick } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                return (
                    <Tile
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={onSelectionClick}
                    />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionClick]
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
    onSelectionClick: func
};

TileList.displayName = 'TileList';

export default TileList;
