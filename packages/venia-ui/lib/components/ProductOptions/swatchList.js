import React from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';
import Swatch from './swatch';

import { mergeClasses } from '../../classify';
import defaultClasses from './swatchList.css';

const SwatchList = props => {
    const { getItemKey, initialSelection, items, onSelectionChange } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <List
            classes={classes}
            getItemKey={getItemKey}
            initialSelection={initialSelection}
            items={items}
            onSelectionChange={onSelectionChange}
            renderItem={Swatch}
        />
    );
};

SwatchList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    initialSelection: object,
    items: arrayOf(object),
    onSelectionChange: func
};

SwatchList.displayName = 'SwatchList';

export default SwatchList;
