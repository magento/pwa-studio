import React, { useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';
import Icon from '../Icon/icon';
import { Check } from 'react-feather';
import { mergeClasses } from '../../classify';

import defaultClasses from './categorySortItem.css';

const CategorySortItem = props => {
    const { onClick, sortItem, active } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(sortItem);
    }, [sortItem, onClick]);

    const activeIcon =
        active === true ? (
            <span className={classes.activeIcon}>
                <Icon src={Check} size={14} />
            </span>
        ) : null;

    return (
        <button className={classes.menuItemButton} onClick={handleClick}>
            <span className={classes.menuItemText}>{sortItem.text}</span>
            {activeIcon}
        </button>
    );
};

CategorySortItem.propTypes = {
    classes: shape({
        menuItemButton: string,
        menuItemText: string,
        activeIcon: string
    }),
    onClick: func,
    active: bool
};

export default CategorySortItem;
