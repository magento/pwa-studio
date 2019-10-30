import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Check as Checkmark } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './filterDefault.css';

const FilterDefault = props => {
    const { classes: propsClasses, isSelected, item, ...restProps } = props;
    const { label } = item || {};
    const classes = mergeClasses(defaultClasses, propsClasses);
    const iconClassName = isSelected ? classes.iconActive : classes.icon;

    return (
        <button className={classes.root} {...restProps}>
            <span className={iconClassName}>
                {isSelected && <Icon src={Checkmark} size={14} />}
            </span>
            <span>{label}</span>
        </button>
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        iconActive: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string
    }),
    label: string
};
