import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import gql from 'graphql-tag';

const GET_ITEM_QUANTITY_GQL = gql`
    query getCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            items {
                id
                quantity
            }
        }
    }
`;

const getTotalQuantity = items =>
    items.reduce((total, item) => total + item.quantity, 0);

export const useCartTrigger = () => {
    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [getItemQuantities, { data }] = useLazyQuery(GET_ITEM_QUANTITY_GQL);

    useEffect(() => {
        if (cartId) {
            getItemQuantities({
                variables: { cartId }
            });
        }
    }, [cartId, getItemQuantities]);

    const handleClick = useCallback(async () => {
        toggleDrawer('cart');
    }, [toggleDrawer]);

    const itemCount =
        data && data.cart && data.cart.items
            ? getTotalQuantity(data.cart.items)
            : 0;

    return {
        handleClick,
        itemCount
    };
};
