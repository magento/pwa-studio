import React, { useCallback } from 'react';
import { shape, string } from 'prop-types';
import { X as Remove } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import Trigger from '../../Trigger';
import defaultClasses from './currentFilter.css';

const CurrentFilter = props => {
    const { group, groupName, item, removeItem } = props;
    const text = `${groupName}: ${item.title}`;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        removeItem({ group, item });
    }, [group, item, removeItem]);

    return (
        <span className={classes.root}>
            <span className={classes.text}>{text}</span>
            <Trigger action={handleClick}>
                <Icon size={16} src={Remove} />
            </Trigger>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    })
};
