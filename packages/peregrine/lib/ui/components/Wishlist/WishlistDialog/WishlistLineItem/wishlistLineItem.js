import React, { useCallback } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './wishlistLineItem.module.css';
import { bool, func, number } from 'prop-types';

const WishlistLineItem = props => {
    const { id, isDisabled, onClick } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <button
            className={classes.root}
            disabled={isDisabled}
            type="button"
            onClick={handleClick}
            data-cy="WishlistLineItem-button"
        >
            <h2
                className={classes.lineItemName}
                data-cy="WishlistLineItem-name"
                title={props.children}
            >
                {props.children}
            </h2>
        </button>
    );
};

export default WishlistLineItem;

WishlistLineItem.defaultProps = {
    id: number,
    isDisabled: bool,
    onClick: func.isRequired
};
