import React from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import LoadingIndicator from '../LoadingIndicator';

import defaultClasses from './body.module.css';
import EditItem from './editItem';
import EmptyMiniCartBody from './emptyMiniCartBody';
import ProductList from './productList';
import { useBody } from '@magento/peregrine/lib/talons/LegacyMiniCart/useBody';

const UPDATING_TEXT = 'Updating Cart...';
const LOADING_TEXT = 'Fetching Cart...';

const Body = props => {
    const {
        beginEditItem,
        cartItems,
        closeDrawer,
        currencyCode,
        endEditItem,
        isCartEmpty,
        isEditingItem,
        isLoading,
        isUpdatingItem
    } = props;

    const talonProps = useBody({
        beginEditItem,
        endEditItem
    });

    const { editItem, handleBeginEditItem, handleEndEditItem } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    if (isUpdatingItem) {
        return <LoadingIndicator>{UPDATING_TEXT}</LoadingIndicator>;
    }

    if (isLoading) {
        return <LoadingIndicator>{LOADING_TEXT}</LoadingIndicator>;
    }

    if (isCartEmpty) {
        return <EmptyMiniCartBody closeDrawer={closeDrawer} />;
    }

    if (isEditingItem) {
        return (
            <EditItem
                currencyCode={currencyCode}
                endEditItem={handleEndEditItem}
                isUpdatingItem={isUpdatingItem}
                item={editItem}
            />
        );
    }

    return (
        <div className={classes.root}>
            <ProductList
                beginEditItem={handleBeginEditItem}
                cartItems={cartItems}
                currencyCode={currencyCode}
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
    isUpdatingItem: bool
};

export default Body;
