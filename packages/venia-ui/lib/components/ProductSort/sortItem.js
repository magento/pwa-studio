import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Check } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import Icon from '../Icon/icon';
import defaultClasses from './sortItem.css';

const SortItem = props => {
    const { active, onClick, sortItem } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(sortItem);
    }, [sortItem, onClick]);

    const activeIcon = active ? <Icon size={20} src={Check} /> : null;

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.text}>
                    <FormattedMessage
                        id={sortItem.id}
                        defaultMessage={sortItem.text}
                    />
                </span>
                {activeIcon}
            </span>
        </button>
    );
};

SortItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func
};

export default SortItem;
