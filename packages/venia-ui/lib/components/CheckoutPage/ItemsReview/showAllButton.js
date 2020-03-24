import React, { useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';

import Icon from '../../Icon';
import { mergeClasses } from '../../../classify';

import defaultClasses from './showAllButton.css';

const ShowAllButton = props => {
    const { onClick } = props;
    const classes = mergeClasses(defaultClasses, props.classes || {});

    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.text}>SHOW ALL ITEMS</span>
                <Icon src={ArrowDown} />
            </span>
        </button>
    );
};

export default ShowAllButton;
