import React, { useEffect } from 'react';
import { bool, func, shape } from 'prop-types';

import { useItemBeingEdited, useQuery } from '@magento/peregrine';

import { loadingIndicator } from 'src/components/LoadingIndicator';
import PRODUCT_DETAILS from 'src/queries/getProductDetailByName.graphql';

import CartOptions from './cartOptions';

const mock = {
    image: {
        disabled: false,
        file: '/v/s/vsk12-ll_main_1.jpg',
        label: 'Main',
        position: 1,
        __typename: 'MediaGalleryEntry'
    },
    item_id: 287,
    name: 'Isadora Skirt',
    options: [
        { value: 'Lilac', label: 'Fashion Color' },
        { value: '2', label: 'Fashion Size' }
    ],
    price: 118,
    product_type: 'configurable',
    qty: 1,
    quote_id: 404,
    sku: 'VSK12-LL'
};

const EditItem = props => {
    // Props.
    const { cart, closeOptionsDrawer, updateItemInCart } = props;

    // State / Hooks.
    //const [itemBeingEdited] = useItemBeingEdited(); // TODO: why this no work?
    let [itemBeingEdited] = useItemBeingEdited();
    if (!itemBeingEdited) {
        console.log('useItemBeingEdited came back null :(');
        itemBeingEdited = mock;
    }
    const [queryResult, queryApi] = useQuery(PRODUCT_DETAILS);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    // Members.
    const itemHasOptions = itemBeingEdited.options.length > 0;

    // Run the query once on mount and again whenever the
    // item being edited changes.
    useEffect(() => {
        setLoading(true);
        console.log('running the query');
        runQuery({
            variables: {
                name: itemBeingEdited.name,
                onServer: false
            }
        });
    }, [itemBeingEdited]);

    /*
     * Render.
     */

    // We must have an item to edit.
    if (!itemBeingEdited) {
        return <span>TODO - no item to edit</span>;
    }

    // Non-Configurable Items.
    if (!itemHasOptions) {
        return (
            <CartOptions
                cartItem={itemBeingEdited}
                closeOptionsDrawer={closeOptionsDrawer}
                configItem={{}}
                isUpdatingItem={cart.isUpdatingItem}
                updateCart={updateItemInCart}
            />
        );
    }

    // We don't have data yet, we're either loading it or
    // in an error situation.
    if (!data) {
        let status;
        if (error) status = <div>Unable to fetch item options</div>;
        if (loading) status = loadingIndicator;

        return <span>{status}</span>;
    }

    // We do have this item's data.
    const itemWithOptions = data.products.items[0];

    return (
        <CartOptions
            cartItem={itemBeingEdited}
            closeOptionsDrawer={closeOptionsDrawer}
            configItem={itemWithOptions}
            isUpdatingItem={cart.isUpdatingItem}
            updateCart={updateItemInCart}
        />
    );
};

EditItem.propTypes = {
    cart: shape({
        isUpdatingItem: bool
    }),
    closeOptionsDrawer: func,
    updateItemInCart: func
};

export default EditItem;
