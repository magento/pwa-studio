import React, { useEffect } from 'react';
import { bool, func, object } from 'prop-types';

import { useQuery } from '@magento/peregrine';

import { loadingIndicator } from 'src/components/LoadingIndicator';
import PRODUCT_DETAILS from 'src/queries/getProductDetailByName.graphql';

import CartOptions from './cartOptions';

const EditItem = props => {
    // Props.
    const { endEditItem, isUpdatingItem, item, updateItemInCart } = props;

    // State / Hooks.
    const [queryResult, queryApi] = useQuery(PRODUCT_DETAILS);
    const { data, error } = queryResult;
    const { runQuery, setLoading } = queryApi;

    // Members.
    const itemHasOptions = item && item.options && item.options.length > 0;

    // Run the query once on mount and again whenever the
    // item being edited changes.
    useEffect(() => {
        // We must have an item with options.
        if (!(item && itemHasOptions)) {
            return;
        }

        setLoading(true);
        runQuery({
            variables: {
                name: item.name,
                onServer: false
            }
        });
    }, [item]);

    /*
     * Render.
     */

    // We must have an item to edit.
    if (!item) {
        // TODO: log an error? Pop a toast?
        return null;
    }

    // This is a non-configurable item, just set configItem to an empty object.
    if (!itemHasOptions) {
        return (
            <CartOptions
                cartItem={item}
                configItem={{}}
                endEditItem={endEditItem}
                isUpdatingItem={isUpdatingItem}
                updateCart={updateItemInCart}
            />
        );
    }

    // We don't have data yet, we're either loading it or
    // in an error situation.
    if (!data) {
        if (error) {
            return <span>Unable to fetch item options.</span>;
        }

        return loadingIndicator;
    }

    // We do have this item's data.
    const itemWithOptions = data.products.items[0];

    return (
        <CartOptions
            cartItem={item}
            configItem={itemWithOptions}
            endEditItem={endEditItem}
            isUpdatingItem={isUpdatingItem}
            updateCart={updateItemInCart}
        />
    );
};

EditItem.propTypes = {
    endEditItem: func,
    isUpdatingItem: bool,
    item: object,
    updateItemInCart: func
};

export default EditItem;
