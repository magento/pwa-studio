import React, { useCallback } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import LoadingIndicator from 'src/components/LoadingIndicator';

import defaultClasses from './body.css';
import EditItem from './editItem';
import EmptyMiniCartBody from './emptyMiniCartBody';
import ProductList from './productList';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>
);

const Body = props => {
    // Props.
    const {
        beginEditItem,
        cartItems,
        closeDrawer,
        currencyCode,
        editItem,
        endEditItem,
        isCartEmpty,
        isEditingItem,
        isLoading,
        isUpdatingItem,
        removeItemFromCart,
        updateItemInCart
    } = props;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);

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
                currencyCode={currencyCode}
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
                cartItems={cartItems}
                currencyCode={currencyCode}
                removeItemFromCart={removeItemFromCart}
            />
        </div>
    );
};

Body.propTypes = {
    beginEditItem: func.isRequired,
    cartItems: array,
    classes: shape({
        root: string
    }),
    closeDrawer: func,
    currencyCode: string,
    editItem: object,
    endEditItem: func,
    isCartEmpty: bool,
    isEditingItem: bool,
    isLoading: bool,
    isUpdatingItem: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default Body;
