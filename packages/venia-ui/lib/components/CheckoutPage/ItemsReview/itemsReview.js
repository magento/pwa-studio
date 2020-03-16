import React from 'react';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import LIST_OF_PRODUCTS_IN_CART_QUERY from './itemsReviewQuery';

import defaultClasses from './itemsReview.css';

const ItemsReview = props => {
    const talonProps = useItemsReview({
        queries: {
            getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
        }
    });

    const { items: itemsInCart, totalQuantity } = talonProps;

    const items = itemsInCart.map(item => (
        <Item
            key={item.id}
            {...item}
            classes={props.classes && props.classes.item}
        />
    ));

    return (
        <div className={defaultClasses.container}>
            <div
                className={defaultClasses.total_quantity}
            >{`(${totalQuantity}) Items in your order`}</div>
            {items}
        </div>
    );
};

export default ItemsReview;
