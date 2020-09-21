import React, { useCallback } from 'react';
import { Check } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Icon from '../Icon/icon';
import defaultClasses from './switcherItem.css';

const SwitcherItem = props => {
    const { active, onClick, switcherItem } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(switcherItem.code);
    }, [switcherItem, onClick]);

    const activeIcon = active ? <Icon size={20} src={Check} /> : null;

    return (
        <button
            className={classes.root}
            disabled={active}
            onClick={handleClick}
        >
            <span className={classes.content}>
                <span className={classes.text}>{switcherItem.label}</span>
                {activeIcon}
            </span>
        </button>
    );
};

SwitcherItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func
};

export default SwitcherItem;
