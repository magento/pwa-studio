import React, { useCallback } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './wishlistLineItem.css';
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
        >
            {props.children}
        </button>
    );
};

export default WishlistLineItem;

WishlistLineItem.defaultProps = {
    id: number,
    isDisabled: bool,
    onClick: func.isRequired
};
