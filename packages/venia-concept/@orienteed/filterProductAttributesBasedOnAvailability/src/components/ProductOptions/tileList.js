import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Tile from '@magento/venia-ui/lib/components/ProductOptions/tile';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/ProductOptions/tileList.module.css';

const TileList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionChange } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                if (!item.status) {
                    return null;
                }

                return <Tile key={getItemKey(item)} isSelected={isSelected} item={item} onClick={onSelectionChange} />;
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
