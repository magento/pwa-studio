import React, { useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Swatch from '@magento/venia-ui/lib/components/ProductOptions/swatch';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/ProductOptions/swatchList.module.css';

const SwatchList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionChange } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const swatches = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;

                if (!item.status) {
                    return null;
                }

                return (
                    <Swatch key={getItemKey(item)} isSelected={isSelected} item={item} onClick={onSelectionChange} />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionChange]
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
