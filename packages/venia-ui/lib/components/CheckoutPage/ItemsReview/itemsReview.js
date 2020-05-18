import React from 'react';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import ShowAllButton from './showAllButton';
import LoadingIndicator from '../../LoadingIndicator';
import { mergeClasses } from '../../../classify';

import LIST_OF_PRODUCTS_IN_CART_QUERY from './itemsReview.gql';

import defaultClasses from './itemsReview.css';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useItemsReview({
        queries: {
            getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
        },
        data: props.data
    });

    const {
        items: itemsInCart,
        totalQuantity,
        showAllItems,
        setShowAllItems,
        isLoading
    } = talonProps;

    const items = itemsInCart.map((item, index) => (
        <Item key={item.id} {...item} isHidden={!showAllItems && index >= 2} />
    ));

    const showAllItemsFooter = !showAllItems ? (
        <ShowAllButton onClick={setShowAllItems} />
    ) : null;

    if (isLoading) {
        return (
            <LoadingIndicator>{`Fetching Items in your Order`}</LoadingIndicator>
        );
    }

    return (
        <div className={classes.items_review_container}>
            <div className={classes.items_container}>
                <div
                    className={classes.total_quantity}
                >{`(${totalQuantity}) Items in your order`}</div>
                {items}
            </div>
            {showAllItemsFooter}
        </div>
    );
};

export default ItemsReview;
