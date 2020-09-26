import React, { useMemo } from 'react';

import { mergeClasses } from '../../classify';
import defaultClasses from './wishlistItems.css';
import WishlistItem from './wishlistItem';

const WishlistItems = props => {
    const { items } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const itemElements = useMemo(() => {
        return items.map(item => {
            return <WishlistItem key={item.id} item={item} />;
        });
    }, [items]);

    return <div className={classes.root}>{itemElements}</div>;
};

export default WishlistItems;
