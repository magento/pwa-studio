import React from 'react';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import LIST_OF_PRODUCTS_IN_CART_QUERY from './itemsReviewQuery';

import defaultClasses from './itemsReview.css';

const ItemsReview = () => {
    const { items: itemsInCart } = useItemsReview({
        queries: {
            getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
        }
    });

    const items = itemsInCart.map(item => {
        return <Item key={item.id} {...item} />;
    });

    return <div className={defaultClasses.container}>{items}</div>;
};

export default ItemsReview;
