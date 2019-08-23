import React, { useCallback, useMemo, useState } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import getOptionType from './getOptionType';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.css';

const getItemKey = ({ value_index }) => value_index;

// TODO: get an explicit field from the API
// that identifies an attribute as a swatch
const getListComponent = (attribute_code, values) => {
    const optionType = getOptionType({ attribute_code, values });

    return optionType === 'swatch' ? SwatchList : TileList;
};

const Option = props => {
    const {
        attribute_code,
        attribute_id,
        label,
        onSelectionChange,
        values
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [selection, setSelection] = useState(null);

    const ValueList = useMemo(() => getListComponent(attribute_code, values), [
        attribute_code,
        values
    ]);

    const valuesMap = useMemo(() => {
        return new Map(
            values.map(value => [value.value_index, value.store_label])
        );
    }, [values]);

    const selectedValueLabel =
        selection != null ? `Selected ${label} : ${selection}` : '';

    const handleSelectionChange = useCallback(
        selection => {
            const [selectedValue] = Array.from(selection);

            setSelection(valuesMap.get(selectedValue));

            if (onSelectionChange) {
                onSelectionChange(attribute_id, selection);
            }
        },
        [attribute_id, onSelectionChange, valuesMap]
    );

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <span>{label}</span>
            </h3>
            <ValueList
                getItemKey={getItemKey}
                items={values}
                onSelectionChange={handleSelectionChange}
            />
            <p className={classes.selection}>{selectedValueLabel}</p>
        </div>
    );
};

export default Option;

Option.propTypes = {
    attribute_id: string,
    attribute_code: string.isRequired,
    classes: shape({
        root: string,
        title: string
    }),
    label: string.isRequired,
    onSelectionChange: func,
    values: arrayOf(object).isRequired
};
