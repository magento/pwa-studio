import React from 'react';
import { shape, string } from 'prop-types';

import Icon from '../../Icon';
import { Filter as FilterIcon } from 'react-feather';
import { mergeClasses } from '../../../classify';
import defaultClasses from './filter.css';

const FILTER_ICON_ATTRS = {
    width: 16,
    color: 'rgb(0, 134, 138)'
};

const Filter = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div className={classes.filterIconContainer}>
                <Icon src={FilterIcon} attrs={FILTER_ICON_ATTRS} />
            </div>
            <span>Filter by...</span>
        </div>
    );
};

Filter.propTypes = {
    classes: shape({
        root: string,
        filterIconContainer: string
    })
};

export default Filter;
