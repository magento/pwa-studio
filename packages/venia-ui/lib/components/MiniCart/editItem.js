import React from 'react';
import { bool, func, object, string } from 'prop-types';

import LoadingIndicator from '../LoadingIndicator';
import PRODUCT_DETAILS from '../../queries/getProductDetailByName.graphql';

import CartOptions from './cartOptions';
import { useEditItem } from '@magento/peregrine/lib/talons/MiniCart/useEditItem';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Item Options...`}</LoadingIndicator>
);

const EditItem = props => {
    const {
        currencyCode,
        endEditItem,
        isUpdatingItem,
        item,
        updateItemInCart
    } = props;

    const talonProps = useEditItem({
        item,
        query: PRODUCT_DETAILS
    });

    const { configItem, hasError, isLoading, itemHasOptions } = talonProps;

    if (hasError) {
        return <span>Unable to fetch item options.</span>;
    }

    // If we are loading, or if we know we have options but haven't received
    // them from the query, render a loading indicator.
    if (isLoading || (itemHasOptions && !configItem)) {
        return loadingIndicator;
    }

    return (
        <CartOptions
            cartItem={item}
            configItem={configItem || {}}
            currencyCode={currencyCode}
            endEditItem={endEditItem}
            isUpdatingItem={isUpdatingItem}
            updateCart={updateItemInCart}
        />
    );
};

EditItem.propTypes = {
    currencyCode: string,
    endEditItem: func,
    isUpdatingItem: bool,
    item: object.isRequired,
    updateItemInCart: func
};

export default EditItem;
