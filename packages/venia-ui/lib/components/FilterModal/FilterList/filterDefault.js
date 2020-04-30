import React from 'react';
import { bool, shape, string } from 'prop-types';
import { CheckSquare, Square } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './filterDefault.css';

const FilterDefault = props => {
    const { classes: propsClasses, isSelected, item, ...restProps } = props;
    const { label } = item || {};
    const classes = mergeClasses(defaultClasses, propsClasses);
    const iconSrc = isSelected ? CheckSquare : Square;

    return (
        <button className={classes.root} {...restProps}>
            <span className={classes.icon}>
                <Icon src={iconSrc} size={20} />
            </span>
            <span>{label}</span>
        </button>
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string
    }),
    label: string
};
