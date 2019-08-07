import React, { useCallback, useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import getOptionType from './getOptionType';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.css';

const Option = props => {
    const {
        attribute_code,
        attribute_id,
        label,
        onSelectionChange,
        selectedVariant,
        values
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleSelectionChange = useCallback(
        selection => {
            if (onSelectionChange) {
                onSelectionChange(attribute_id, selection);
            }
        },
        [attribute_id, onSelectionChange]
    );

    const CustomList = useMemo(() => {
        // TODO: get an explicit field from the API
        // that identifies an attribute as a swatch
        const optionType = getOptionType({ attribute_code, values });

        return optionType === 'swatch' ? SwatchList : TileList;
    }, [attribute_code, values]);

    let initialSelection = {};
    if (selectedVariant) {
        // If we have a selected variant, pass it through to List.
        // Attempt to find an option of the variant that's one of the product's configurable options.
        // If found, set that configurable option as the initial selection of the List.
        selectedVariant.options.find(option => {
            const { value: variantValue } = option;

            const matchingValue = values.find(potentialMatchingValue => {
                const { default_label: value } = potentialMatchingValue;

                return value === variantValue;
            });

            if (matchingValue) {
                initialSelection = matchingValue;
            }
        });
    }

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <span>{label}</span>
            </h3>
            <CustomList
                getItemKey={({ value_index }) => value_index}
                initialSelection={initialSelection}
                items={values}
                onSelectionChange={handleSelectionChange}
            />
        </div>
    );
};

Option.propTypes = {
    attribute_code: string.isRequired,
    attribute_id: string,
    classes: shape({
        root: string,
        title: string
    }),
    label: string.isRequired,
    onSelectionChange: func,
    selectedVariant: object,
    values: arrayOf(object).isRequired
};

export default Option;
