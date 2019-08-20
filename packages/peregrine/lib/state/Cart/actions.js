import { useEffect } from 'react';
import { useCartContext } from './context';
import { useRestApi } from '../../hooks/useRestApi';

const AUTHED_CART_ENDPOINT = '/rest/V1/carts/mine';
const GUEST_CART_ENDPOINT = '/rest/V1/guest-carts';

const CART_METHOD_OPTIONS = {
    method: 'POST'
};

/**
 * Uses the REST endpoint to create a cart if one doesn't exist. Once it creates
 * a cart it stores the id in the cart context.
 * @param {boolean} isSignedIn
 */
export const useCreateCart = isSignedIn => {
    const [{ cartId }, cartApi] = useCartContext();
    const cartEndpoint = isSignedIn
        ? AUTHED_CART_ENDPOINT
        : GUEST_CART_ENDPOINT;
    const [state, api] = useRestApi(cartEndpoint);

    const { data, loading, error } = state;

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
            throw Error(error);
        }
    }, [error]);
};
