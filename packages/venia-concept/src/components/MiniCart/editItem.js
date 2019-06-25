import React, { useEffect } from 'react';
import { bool, func, object, string } from 'prop-types';

import { useQuery } from '@magento/peregrine';

import LoadingIndicator from 'src/components/LoadingIndicator';
import PRODUCT_DETAILS from 'src/queries/getProductDetailByName.graphql';

import CartOptions from './cartOptions';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Item Options...`}</LoadingIndicator>
);

const EditItem = props => {
    // Props.
    const {
        currencyCode,
        endEditItem,
        isUpdatingItem,
        item,
        updateItemInCart
    } = props;

    // State / Hooks.
    const [queryResult, queryApi] = useQuery(PRODUCT_DETAILS);
    const { data, error, loading } = queryResult;
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

        const fetchItemOptions = async () => {
            setLoading(true);

            await runQuery({
                variables: {
                    name: item.name,
                    onServer: false
                }
            });

            setLoading(false);
        };

        fetchItemOptions();
    }, [item, itemHasOptions, runQuery, setLoading]);

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
                currencyCode={currencyCode}
                endEditItem={endEditItem}
                isUpdatingItem={isUpdatingItem}
                updateCart={updateItemInCart}
            />
        );
    }

    if (error) {
        return <span>Unable to fetch item options.</span>;
    }
    if (loading || !data) {
        return loadingIndicator;
    }

    // We do have this item's data.
    const itemWithOptions = data.products.items[0];

    return (
        <CartOptions
            cartItem={item}
            configItem={itemWithOptions}
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
    item: object,
    updateItemInCart: func
};

export default EditItem;
