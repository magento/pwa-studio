import React, { useState, useMemo } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';

import classify from '../../classify';
import getOptionType from './getOptionType';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.css';

const getItemKey = ({ value_index }) => value_index;

const Option = props => {
    const [selection, setSelection] = useState(null);
    const valuesMap = useMemo(() => {
        return new Map(
            props.values.map(value => [value.value_index, value.store_label])
        );
    }, [props.values]);

    const handleSelectionChange = selection => {
        const { attribute_id, onSelectionChange } = props;

        if (onSelectionChange) {
            onSelectionChange(attribute_id, selection);
        }
        setSelection(selection);
    };

    function getListComponent() {
        const { attribute_code, values } = props;

        // TODO: get an explicit field from the API
        // that identifies an attribute as a swatch
        const optionType = getOptionType({ attribute_code, values });

        return optionType === 'swatch' ? SwatchList : TileList;
    }

    const ValueList = getListComponent();
    const { classes, label, values } = props;
    const selectedValueLabel = selection
        ? `Selected ${label} : ${valuesMap.get(Array.from(selection).pop())}`
        : '';
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

export default classify(defaultClasses)(Option);
