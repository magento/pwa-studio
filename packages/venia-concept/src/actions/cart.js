import { RestApi } from '@magento/peregrine';

import { toggleDrawer, closeDrawer } from 'src/actions/app';

const { request } = RestApi.Magento2;

const createGuestCart = async dispatch => {
    let payload, error;

    try {
        payload = await request('/rest/V1/guest-carts', {
            method: 'POST'
        });
    } catch (e) {
        payload = e;
        error = true;
    }

    dispatch({
        type: 'CREATE_GUEST_CART',
        payload,
        error
    });

    return payload;
};

const getGuestCartId = async function(dispatch, getState) {
    const { cart } = getState();

    if (!cart) {
        throw new Error('Cart state is not ready yet.');
    }

    if (!cart.guestCartId) {
        await createGuestCart(...arguments);
    }

    return cart.guestCartId;
};

const addItemToCart = ({ item, quantity }) =>
    async function thunk(...args) {
        const [dispatch] = args;
        const guestCartId = await getGuestCartId(...args);
        let payload, error;

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

            payload = {
                cartItem,
                item,
                quantity
            };
        } catch (e) {
            if (e.response && e.response.status === 404) {
                // guest cart expired!
                await createGuestCart(...args);
                // re-execute this thunk
                return thunk(...args);
            }

            payload = e;
            error = true;
        }

        dispatch({
            type: 'ADD_ITEM_TO_CART',
            payload,
            error
        });

        await Promise.all([
            getCartDetails({ forceRefresh: true })(...args),
            toggleCart()(...args)
        ]);
    };

const fetchCartPart = async ({ guestCartId, forceRefresh, subResource = '' }) =>
    request(`/rest/V1/guest-carts/${guestCartId}/${subResource}`, {
        cache: forceRefresh ? 'reload' : 'default'
    });

const getCartDetails = ({ forceRefresh } = {}) =>
    async function thunk(...args) {
        const [dispatch] = args;
        const guestCartId = await getGuestCartId(...args);
        let payload, error;

        try {
            const [details, totals] = await Promise.all([
                fetchCartPart({ guestCartId, forceRefresh }),
                fetchCartPart({
                    guestCartId,
                    forceRefresh,
                    subResource: 'totals'
                })
            ]);

            payload = {
                details,
                totals
            };
        } catch (e) {
            if (e.response && e.response.status === 404) {
                // guest cart expired!
                await createGuestCart(...args);
                // re-execute this thunk
                return thunk(...args);
            }
            payload = e;
            error = true;
        }

        dispatch({
            type: 'GET_CART_DETAILS',
            payload,
            error
        });
    };

const toggleCart = () => async (...args) => {
    const [, getState] = args;
    const { app, cart } = getState();

    if (!app || !cart) {
        return;
    }

    const { drawer } = app;

    // if this toggle closes the cart, just close the cart
    if (drawer === 'cart') {
        return closeDrawer(...args);
    }

    const preparingCart = [getCartDetails()(...args)];

    // if another drawer is open, then close it
    if (drawer) {
        preparingCart.push(closeDrawer(...args));
    }
    // no cart populated? wait to show the drawer so it's not blank
    if (!cart.id) {
        await Promise.all(preparingCart);
    }

    await toggleDrawer('cart')(...args);
};

export { addItemToCart, getCartDetails, getGuestCartId, toggleCart };
