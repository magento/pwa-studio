import React, { useMemo } from 'react';
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
import { useOption } from '@magento/peregrine/lib/talons/ProductOptions/useOption';

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
        onSelectionClick,
        selectedValue,
        values
    } = props;

    const talonProps = useOption({
        attribute_id,
        label,
        onSelectionClick,
        selectedValue,
        values
    });

    const {
        handleSelectionClick,
        initialSelection,
        selectedValueLabel,
        selectedValueDescription
    } = talonProps;

    const ValueList = useMemo(() => getListComponent(attribute_code, values), [
        attribute_code,
        values
    ]);

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <span>{label}</span>
            </h3>
            <ValueList
                getItemKey={getItemKey}
                selectedValue={initialSelection}
                items={values}
                onSelectionClick={handleSelectionClick}
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
    onSelectionClick: func,
    selectedValue: oneOfType([number, string]),
    values: arrayOf(object).isRequired
};

export default Option;
