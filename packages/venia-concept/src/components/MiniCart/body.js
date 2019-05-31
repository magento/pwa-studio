import React, { useCallback } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import { loadingIndicator } from 'src/components/LoadingIndicator';

import defaultClasses from './body.css';
import EditItem from './editItem';
import EmptyMiniCartBody from './emptyMiniCartBody';
import ProductList from './productList';

const Body = props => {
    // Props.
    const {
        beginEditItem,
        cart,
        closeDrawer,
        endEditItem,
        isCartEmpty,
        isMiniCartMaskOpen,
        removeItemFromCart,
        updateItemInCart
    } = props;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const { editItem, isLoading, isEditingItem, isUpdatingItem } = cart;

    // Callbacks.
    const handleEditItem = useCallback(
        item => {
            beginEditItem(item);
        },
        [beginEditItem]
    );

    // Render.
    if (isLoading) {
        return loadingIndicator;
    }

    if (isCartEmpty) {
        return <EmptyMiniCartBody closeDrawer={closeDrawer} />;
    }

    if (isEditingItem) {
        return (
            <EditItem
                endEditItem={endEditItem}
                isUpdatingItem={isUpdatingItem}
                item={editItem}
                updateItemInCart={updateItemInCart}
            />
        );
    }

    return (
        <div className={classes.root}>
            <ProductList
                beginEditItem={handleEditItem}
                cart={cart}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
                items={cart.details.items}
                removeItemFromCart={removeItemFromCart}
                totalsItems={cart.totals.items}
            />
        </div>
    );
};

Body.propTypes = {
    beginEditItem: func.isRequired,
    cart: shape({
        details: shape({
            items: array
        }).isRequired,
        editItem: object,
        isEditingItem: bool,
        isLoading: bool,
        isUpdatingItem: bool,
        totals: shape({
            items: array
        }).isRequired
    }).isRequired,
    classes: shape({
        root: string
    }),
    closeDrawer: func,
    endEditItem: func,
    isCartEmpty: bool,
    isMiniCartMaskOpen: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default Body;
