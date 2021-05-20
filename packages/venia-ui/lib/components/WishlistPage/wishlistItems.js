import React, { useMemo } from 'react';

import { useStyle } from '../../classify';
import defaultClasses from './wishlistItems.css';
import WishlistItem from './wishlistItem';

const WishlistItems = props => {
    const { items, wishlistId } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const itemElements = useMemo(() => {
        return items.map(item => {
            return (
                <WishlistItem
                    key={item.id}
                    item={item}
                    wishlistId={wishlistId}
                />
            );
        });
    }, [items, wishlistId]);

    return <div className={classes.root}>{itemElements}</div>;
};

export default WishlistItems;
