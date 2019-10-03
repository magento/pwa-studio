import React, { useCallback, useMemo, useState } from 'react';
import {
    arrayOf,
    func,
    number,
    object,
    oneOfType,
    shape,
    string
} from 'prop-types';

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
        selectedValue,
        values
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [selection, setSelection] = useState(null);

    const initialSelection = useMemo(() => {
        let initialSelection = {};
        const searchValue = selection || selectedValue;
        if (searchValue) {
            initialSelection =
                values.find(value => value.default_label === searchValue) || {};
        }
        return initialSelection;
    }, [selectedValue, selection, values]);

    const ValueList = useMemo(() => getListComponent(attribute_code, values), [
        attribute_code,
        values
    ]);

    const valuesMap = useMemo(() => {
        return new Map(
            values.map(value => [value.value_index, value.store_label])
        );
    }, [values]);

    const selectedValueLabel = `Selected ${label}:`;
    const selectedValueDescription =
        selection || initialSelection.default_label || 'None';

    const handleSelectionChange = useCallback(
        selection => {
            setSelection(valuesMap.get(selection));

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
                selectedValue={initialSelection}
                items={values}
                onSelectionChange={handleSelectionChange}
            />
            <dl className={classes.selection}>
                <dt className={classes.selectionLabel}>{selectedValueLabel}</dt>
                <dd>{selectedValueDescription}</dd>
            </dl>
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
    selectedValue: oneOfType([number, string]),
    values: arrayOf(object).isRequired
};

export default Option;
