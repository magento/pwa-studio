import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Swatch from './swatch';

import { mergeClasses } from '../../classify';
import defaultClasses from './swatchList.css';

const SwatchList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionClick } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const swatches = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                return (
                    <Swatch
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={onSelectionClick}
                    />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionClick]
    );

    return <div className={classes.root}>{swatches}</div>;
};

SwatchList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    selectedValue: object,
    items: arrayOf(object),
    onSelectionClick: func
};

SwatchList.displayName = 'SwatchList';

export default SwatchList;
