import { RestApi } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';

const { request } = RestApi.Magento2;

const createGuestCart = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { checkout } = getState();

        if (checkout && checkout.status === 'ACCEPTED') {
            dispatch({ type: 'RESET_CHECKOUT' });
        }

        try {
            const response = await request('/rest/V1/guest-carts', {
                method: 'POST'
            });

            dispatch({
                type: 'CREATE_GUEST_CART',
                payload: response
            });
        } catch (error) {
            dispatch({
                type: 'CREATE_GUEST_CART',
                payload: error,
                error: true
            });
        }
    };

const addItemToCart = payload => {
    const { item, quantity } = payload;

    return async function thunk(...args) {
        const [dispatch] = args;
        const guestCartId = await getGuestCartId(...args);

        try {
            const cartItem = await request(
                `/rest/V1/guest-carts/${guestCartId}/items`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        cartItem: {
                            qty: quantity,
                            sku: item.sku,
                            name: item.name,
                            quote_id: guestCartId
                        }
                    })
                }
            );

            dispatch({
                type: 'ADD_ITEM_TO_CART',
                payload: {
                    cartItem,
                    item,
                    quantity
                }
            });
        } catch (error) {
            const { response } = error;

            if (response && response.status === 404) {
                // guest cart expired!
                await dispatch(createGuestCart());
                // re-execute this thunk
                return thunk(...args);
            }

            dispatch({
                type: 'ADD_ITEM_TO_CART',
                payload: error,
                error: true
            });
        }

        await Promise.all([
            getCartDetails({ forceRefresh: true })(...args),
            toggleCart()(...args)
        ]);

        return payload;
    };
};

const getCartDetails = (payload = {}) => {
    const { forceRefresh } = payload;

    return async function thunk(...args) {
        const [dispatch] = args;
        const guestCartId = await getGuestCartId(...args);

        try {
            const [details, totals] = await Promise.all([
                fetchCartPart({ guestCartId, forceRefresh }),
                fetchCartPart({
                    guestCartId,
                    forceRefresh,
                    subResource: 'totals'
                })
            ]);

            dispatch({
                type: 'GET_CART_DETAILS',
                payload: { details, totals }
            });
        } catch (error) {
            const { response } = error;

            if (response && response.status === 404) {
                // guest cart expired!
                await dispatch(createGuestCart());
                // re-execute this thunk
                return thunk(...args);
            }

            dispatch({
                type: 'GET_CART_DETAILS',
                payload: error,
                error: true
            });
        }

        return payload;
    };
};

const toggleCart = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { app, cart } = getState();

        // ensure state slices are present
        if (!app || !cart) {
            return;
        }

        // if the cart drawer is open, close it
        if (app.drawer === 'cart') {
            await dispatch(closeDrawer());
            return;
        }

        // otherwise open the cart and load its contents
        await Promise.all([
            dispatch(getCartDetails()),
            dispatch(toggleDrawer('cart'))
        ]);
    };

async function fetchCartPart({ guestCartId, forceRefresh, subResource = '' }) {
    if (!guestCartId) {
        return null;
    }

    return request(`/rest/V1/guest-carts/${guestCartId}/${subResource}`, {
        cache: forceRefresh ? 'reload' : 'default'
    });
}

async function getGuestCartId(dispatch, getState) {
    const { cart } = getState();

    // reducers may be added asynchronously
    if (!cart) {
        return null;
    }

    // create a guest cart if one hasn't been created yet
    if (!cart.guestCartId) {
        await dispatch(createGuestCart());
    }

    // retrieve app state again
    return getState().cart.guestCartId;
}

export { addItemToCart, getCartDetails, getGuestCartId, toggleCart };
