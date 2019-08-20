import { useEffect } from 'react';

import { useCartContext } from '../Cart';
import { useUserContext } from '../User';
import { useRestApi } from '../../hooks/useRestApi';

const AUTHED_CART_ENDPOINT = '/rest/V1/carts/mine';
const GUEST_CART_ENDPOINT = '/rest/V1/guest-carts';
const AUTHED_ITEMS_ENDPOINT = `${AUTHED_CART_ENDPOINT}/items`;

const CART_METHOD_OPTIONS = {
    method: 'POST'
};

/**
 * Uses the REST endpoint to create a cart if one doesn't exist. Once it creates
 * a cart it stores the id in the cart context.
 */
export const useCreateCart = () => {
    const [{ cartId }, cartApi] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const endpoint = isSignedIn ? AUTHED_CART_ENDPOINT : GUEST_CART_ENDPOINT;
    const [{ data, loading, error }, api] = useRestApi(endpoint);

    useEffect(() => {
        if (!cartId && !loading && !data) {
            api.sendRequest({
                options: CART_METHOD_OPTIONS
            });
        }
    }, [api, cartId, loading, data]);

    useEffect(() => {
        if (data) {
            cartApi.setCartId(data);
        }
    }, [cartApi, data]);

    useEffect(() => {
        if (error) {
            throw Error(`Unable to create cart:`, error);
        }
    }, [error]);
};
