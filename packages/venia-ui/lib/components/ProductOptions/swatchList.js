import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Swatch from './swatch';

import { useStyle } from '../../classify';
import defaultClasses from './swatchList.module.css';

const SwatchList = props => {
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
    const swatches = useMemo(
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
                    <Swatch
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

    return <div className={classes.root}>{swatches}</div>;
};

SwatchList.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func,
    selectedValue: object,
    items: arrayOf(object),
    onSelectionChange: func
};

SwatchList.displayName = 'SwatchList';

export default SwatchList;
