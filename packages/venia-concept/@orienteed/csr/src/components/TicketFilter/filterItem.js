import React, { useCallback } from 'react';
import { Square, CheckSquare } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './filterItem.module.css';

const FilterItem = props => {
    const { active, onClick, filterItem } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(
        e => {
            // use only left click for selection
            if (e.button === 0) {
                onClick(filterItem);
            }
        },
        [filterItem, onClick]
    );

    const handleKeyDown = useCallback(
        e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(filterItem);
            }
        },
        [onClick, filterItem]
    );

    const activeIcon = active ? <Icon size={20} src={CheckSquare} /> : <Icon size={20} src={Square} />;

    return (
        <button
            className={classes.root}
            data-cy={active ? 'SortItem-activeButton' : 'SortItem-button'}
            onMouseDown={handleClick}
            onKeyDown={handleKeyDown}
        >
            <span className={classes.content}>
                <span className={classes.text}>{filterItem.text}</span>
                {activeIcon}
            </span>
        </button>
    );
};

FilterItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func
};

export default FilterItem;
