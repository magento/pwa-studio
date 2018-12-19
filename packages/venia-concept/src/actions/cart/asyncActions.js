import { RestApi } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';
import checkoutActions from 'src/actions/checkout';
import actions from './actions';
import { Util } from '@magento/peregrine';

import * as api from './api';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const createCartRequest = () => async dispatch => {
    await clearGuestCartId();

    dispatch(actions.getGuestCart.request());

    try {
        const id = await api.createCart();

        // write to storage in the background
        saveGuestCartId(id);
        dispatch(actions.getGuestCart.receive(id));
    } catch (error) {
        dispatch(actions.getGuestCart.receive(error));
    }
};

// TODO: rename guestCartId to just cartId in state.
// We are going to use guestCartId for storing cartId for authorized user too.
export const createCart = () =>
    async function thunk(dispatch, getState) {
        const { cart } = getState();

        // if a guest cart already exists, exit
        if (cart.guestCartId) {
            return;
        }

        // reset the checkout workflow
        // in case the user has already completed an order this session
        dispatch(checkoutActions.reset());

        const guestCartId = await retrieveGuestCartId();

        // if a guest cart exists in storage, act like we just received it
        if (guestCartId) {
            dispatch(actions.getGuestCart.receive(guestCartId));
            return;
        }

        return dispatch(createCartRequest());
    };

export const addItemToCart = (payload = {}) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        try {
            const { cart } = getState();
            const { guestCartId } = cart;

            if (!guestCartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: guestCartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            const cartItem = await api.addItemToCart(guestCartId, payload);

            dispatch(actions.addItem.receive({ cartItem, item, quantity }));
        } catch (error) {
            const { response, noGuestCartId } = error;

            dispatch(actions.addItem.receive(error));

            // check if the guest cart has expired
            if (noGuestCartId || (response && response.status === 404)) {
                // if so, then delete the cached ID...
                // in contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearGuestCartId();
                // then create a new one
                await dispatch(createCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }

        await Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails({ forceRefresh: true }))
        ]);
    };
};

export const removeItemFromCart = payload => {
    const { item } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.removeItem.request(payload));

        try {
            const { cart } = getState();
            const { guestCartId } = cart;
            const cartItemCount = cart.details ? cart.details.items_count : 0;

            if (!guestCartId) {
                const missingGuestCartError = new Error(
                    'Missing required information: guestCartId'
                );
                missingGuestCartError.noGuestCartId = true;
                throw missingGuestCartError;
            }

            const cartItem = await request(
                `/rest/V1/guest-carts/${guestCartId}/items/${item.item_id}`,
                {
                    method: 'DELETE'
                }
            );
            // When removing the last item in the cart, perform a reset
            // to prevent a bug where the next item added to the cart has
            // a price of 0
            if (cartItemCount == 1) {
                await clearGuestCartId();
            }

            dispatch(
                actions.removeItem.receive({ cartItem, item, cartItemCount })
            );
        } catch (error) {
            const { response, noGuestCartId } = error;

            dispatch(actions.removeItem.receive(error));

            // check if the guest cart has expired
            if (noGuestCartId || (response && response.status === 404)) {
                // if so, then delete the cached ID...
                // in contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearGuestCartId();
                // then create a new one
                await dispatch(createCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }

        await Promise.all([dispatch(getCartDetails({ forceRefresh: true }))]);
    };
};

export const getCartDetails = (payload = {}) => {
    const { forceRefresh } = payload;

    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { guestCartId } = cart;

        dispatch(actions.getDetails.request(guestCartId));

        // if there isn't a guest cart, create one
        // then retry this operation
        if (!guestCartId) {
            await dispatch(createCart());
            return thunk(...arguments);
        }

        try {
            const [
                imageCache,
                details,
                paymentMethods,
                totals
            ] = await Promise.all([
                retrieveImageCache(),
                api.fetchCartPart({ cartId: guestCartId, forceRefresh }),
                api.fetchCartPart({
                    cartId: guestCartId,
                    forceRefresh,
                    subResource: 'payment-methods'
                }),
                api.fetchCartPart({
                    cartId: guestCartId,
                    forceRefresh,
                    subResource: 'totals'
                })
            ]);

            const { items } = details;

            // for each item in the cart, look up its image in the cache
            // and merge it into the item object
            // then assign its options from the totals subResource
            if (imageCache && Array.isArray(items) && items.length) {
                const validTotals = totals && totals.items;
                items.forEach(item => {
                    item.image = item.image || imageCache[item.sku] || {};

                    let options = [];
                    if (validTotals) {
                        const matchingItem = totals.items.find(
                            t => t.item_id === item.item_id
                        );
                        if (matchingItem && matchingItem.options) {
                            options = JSON.parse(matchingItem.options);
                        }
                    }
                    item.options = options;
                });
            }

            dispatch(
                actions.getDetails.receive({ details, paymentMethods, totals })
            );
        } catch (error) {
            const { response } = error;

            dispatch(actions.getDetails.receive(error));

            // check if the guest cart has expired
            if (response && response.status === 404) {
                // if so, then delete the cached ID...
                // in contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearGuestCartId();
                // then create a new one
                await dispatch(createCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const getShippingMethods = () => {
    return async function thunk(dispatch, getState) {
        const { cart } = getState();
        const { guestCartId } = cart;

        try {
            // if there isn't a guest cart, create one
            // then retry this operation
            if (!guestCartId) {
                await dispatch(createCart());
                return thunk(...arguments);
            }

            dispatch(actions.getShippingMethods.request(guestCartId));

            const response = await request(
                `/rest/V1/guest-carts/${guestCartId}/estimate-shipping-methods`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        address: {
                            country_id: 'US',
                            postcode: null
                        }
                    })
                }
            );

            dispatch(actions.getShippingMethods.receive(response));
        } catch (error) {
            const { response } = error;

            dispatch(actions.getShippingMethods.receive(error));

            // check if the guest cart has expired
            if (response && response.status === 404) {
                // if so, clear it out, get a new one, and retry.
                await clearGuestCartId();
                await dispatch(createCart());
                return thunk(...arguments);
            }
        }
    };
};

export const toggleCart = () =>
    async function thunk(dispatch, getState) {
        const { app, cart } = getState();

        // ensure state slices are present
        if (!app || !cart) {
            return;
        }

        // if the cart drawer is open, close it
        if (app.drawer === 'cart') {
            return dispatch(closeDrawer());
        }

        // otherwise open the cart and load its contents
        await Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails())
        ]);
    };

export const removeGuestCart = () =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { cart } = getState();
        // ensure state slices are present
        if (!cart) {
            return;
        }
        if (cart['guestCartId']) {
            dispatch({
                type: 'REMOVE_GUEST_CART'
            });
        }
    };

/* helpers */

export async function getGuestCartId(dispatch, getState) {
    const { cart } = getState();
    // reducers may be added asynchronously
    if (!cart) {
        return null;
    }
    // create a guest cart if one hasn't been created yet
    if (!cart.guestCartId) {
        await dispatch(createCart());
    }
    // retrieve app state again
    return getState().cart.guestCartId;
}

export async function retrieveGuestCartId() {
    return storage.getItem('guestCartId');
}

export async function saveGuestCartId(id) {
    return storage.setItem('guestCartId', id);
}

export async function clearGuestCartId() {
    return storage.removeItem('guestCartId');
}

async function retrieveImageCache() {
    return storage.getItem('imagesBySku') || {};
}

async function saveImageCache(cache) {
    return storage.setItem('imagesBySku', cache);
}

async function writeImageToCache(item = {}) {
    const { media_gallery_entries: media, sku } = item;

    if (sku) {
        const image = media && (media.find(m => m.position === 1) || media[0]);

        if (image) {
            const imageCache = await retrieveImageCache();

            // if there is an image and it differs from cache
            // write to cache and save in the background
            if (imageCache[sku] !== image) {
                imageCache[sku] = image;
                saveImageCache(imageCache);

                return image;
            }
        }
    }
}
