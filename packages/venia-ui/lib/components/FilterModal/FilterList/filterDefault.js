import React from 'react';
import { bool, shape, string } from 'prop-types';

import Checkbox from '../../Checkbox';
import { mergeClasses } from '../../../classify';
import defaultClasses from './filterDefault.css';

const FilterDefault = props => {
    const { classes: propsClasses, isSelected, item, ...restProps } = props;
    const { label, value_index } = item || {};
    const classes = mergeClasses(defaultClasses, propsClasses);

    return (
        <Checkbox
            classes={classes.root}
            field={`${label}-${value_index}`}
            fieldState={{
                value: isSelected
            }}
            label={label}
            {...restProps}
        />
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
