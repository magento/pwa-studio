import React, { useCallback } from 'react';
import { shape, string } from 'prop-types';
import { X as Remove } from 'react-feather';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import Trigger from '../../Trigger';
import defaultClasses from './currentFilter.css';

const CurrentFilter = props => {
    const { group, item, removeItem } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        removeItem({ group, item });
    }, [group, item, removeItem]);

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

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    })
};
