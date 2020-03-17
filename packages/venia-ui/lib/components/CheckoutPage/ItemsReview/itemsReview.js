import React from 'react';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import ShowAllItemsFooter from './showAllItemsFooter';
import LoadingIndicator from '../../LoadingIndicator';

import LIST_OF_PRODUCTS_IN_CART_QUERY from './itemsReviewQuery';

import defaultClasses from './itemsReview.css';

const ItemsReview = props => {
    const talonProps = useItemsReview({
        queries: {
            getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
        }
    });

    const {
        items: itemsInCart,
        totalQuantity,
        showAllItems,
        setShowAllItems,
        isLoading
    } = talonProps;

    const items = itemsInCart.map(item => (
        <Item
            key={item.id}
            {...item}
            classes={props.classes && props.classes.item}
        />
    ));

    const showAllItemsFooter = !showAllItems ? (
        <ShowAllItemsFooter onFooterClick={setShowAllItems} />
    ) : null;

    if (isLoading) {
        return (
            <LoadingIndicator>{`Fetching Items in your Order`}</LoadingIndicator>
        );
    }

    return (
        <div className={defaultClasses.items_review_container}>
            <div className={defaultClasses.items_container}>
                <div
                    className={defaultClasses.total_quantity}
                >{`(${totalQuantity}) Items in your order`}</div>
                {items}
            </div>
            {showAllItemsFooter}
        </div>
    );
};

export default ItemsReview;
