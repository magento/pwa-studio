import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Swatch from './swatch';

import { mergeClasses } from '../../classify';
import defaultClasses from './swatchList.css';

const SwatchList = props => {
    const {
        getItemKey,
        initialSelection = {},
        items,
        onSelectionChange
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const swatches = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === initialSelection.label;

                return (
                    <Swatch
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={onSelectionChange}
                    />
                );
            }),
        [getItemKey, initialSelection.label, items, onSelectionChange]
    );

    return <div className={classes.root}>{swatches}</div>;
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
