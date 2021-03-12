import React, { useCallback } from 'react';
import { mergeClasses } from '../../../classify';

import defaultClasses from './wishlistLineItem.css';

const WishlistLineItem = props => {
    const { id, isDisabled, onClick } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <button
            classes={classes.root}
            disabled={isDisabled}
            type="button"
            onClick={handleClick}
        >
            {props.children}
        </button>
    );
};

export default WishlistLineItem;
