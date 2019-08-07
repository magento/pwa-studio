import React from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';
import Tile from './tile';

import { mergeClasses } from '../../classify';
import defaultClasses from './tileList.css';

const TileList = props => {
    const { getItemKey, initialSelection, items, onSelectionChange } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <List
            classes={classes}
            getItemKey={getItemKey}
            initialSelection={initialSelection}
            items={items}
            onSelectionChange={onSelectionChange}
            renderItem={Tile}
        />
    );
};

TileList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    initialSelection: object,
    items: arrayOf(object),
    onSelectionChange: func
};

TileList.displayName = 'TileList';

export default TileList;
