import React, { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Check } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';
import { useButton } from 'react-aria';

import { useStyle } from '../../classify';
import Icon from '../Icon/icon';
import defaultClasses from './sortItem.module.css';

const SortItem = props => {
    const { active, onClick, sortItem } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(sortItem);
    }, [sortItem, onClick]);
    const buttonRef = useRef();

    const { buttonProps } = useButton({ onPress: handleClick }, buttonRef);

    const activeIcon = active ? <Icon size={20} src={Check} /> : null;

    return (
        <button
            ref={buttonRef}
            className={classes.root}
            data-cy={active ? 'SortItem-activeButton' : 'SortItem-button'}
            {...buttonProps}
        >
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
