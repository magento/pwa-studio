import React, { useCallback } from 'react';
import { shape, string, func } from 'prop-types';
import { X as Remove } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import Trigger from '../../Trigger';
import defaultClasses from './currentFilter.css';

const CurrentFilter = props => {
    const { group, item, removeItem, handleApply } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof handleApply === 'function') {
            handleApply(group, item);
        }
    }, [group, item, removeItem, handleApply]);

    return (
        <span className={classes.root}>
            <Trigger action={handleClick}>
                <Icon size={20} src={Remove} />
            </Trigger>
            <span className={classes.text}>{item.title}</span>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    handleApply: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    handleApply: func
};
