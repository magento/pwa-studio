import { RestApi } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';
import checkoutActions from 'src/actions/checkout';
import actions from './actions';
import { Util } from '@magento/peregrine';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const createGuestCart = () =>
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

        // otherwise, request a new guest cart
        dispatch(actions.getGuestCart.request());

        try {
            const id = await request('/rest/V1/guest-carts', {
                method: 'POST'
            });

            // write to storage in the background
            saveGuestCartId(id);
            dispatch(actions.getGuestCart.receive(id));
        } catch (error) {
            dispatch(actions.getGuestCart.receive(error));
        }
    };

export const addItemToCart = (payload = {}) => {
    const { item, options, parentSku, productType, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        const { user } = getState();
        if (user.isSignedIn) {
            // TODO: handle authed carts
            // if a user creates an account,
            // then the guest cart will be transferred to their account
            // causing `/guest-carts` to 400
            return;
        }

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

            // TODO: change to GraphQL mutation
            // for now, manually transform the payload for REST
            const itemPayload = {
                qty: quantity,
                sku: item.sku,
                name: item.name,
                quote_id: guestCartId
            };

            if (productType === 'ConfigurableProduct') {
                Object.assign(itemPayload, {
                    sku: parentSku,
                    product_type: 'configurable',
                    product_option: {
                        extension_attributes: {
                            configurable_item_options: options
                        }
                    }
                });
            }

            const cartItem = await request(
                `/rest/V1/guest-carts/${guestCartId}/items`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        cartItem: itemPayload
                    })
                }
            );

            dispatch(actions.addItem.receive({ cartItem, item, quantity }));

            // 2019-02-07  Moved these dispatches to the success clause of
            // addItemToCart. The cart should only open on success.
            // In the catch clause, this action creator calls its own thunk,
            // so a successful retry will wind up here anyway.
            await dispatch(getCartDetails({ forceRefresh: true }));
            await dispatch(toggleDrawer('cart'));
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
                await dispatch(createGuestCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const updateItemInCart = (payload = {}, targetItemId) => {
    const { item, options, parentSku, productType, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.updateItem.request(payload));

        const { user } = getState();
        if (user.isSignedIn) {
            // TODO: handle authed carts
            // if a user creates an account,
            // then the guest cart will be transferred to their account
            // causing `/guest-carts` to 400
            return;
        }

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

            // TODO: change to GraphQL mutation
            // for now, manually transform the payload for REST
            const itemPayload = {
                qty: quantity,
                sku: item.sku,
                name: item.name,
                quote_id: guestCartId
            };

            if (productType === 'ConfigurableProduct') {
                Object.assign(itemPayload, {
                    sku: parentSku,
                    product_type: 'configurable',
                    product_option: {
                        extension_attributes: {
                            configurable_item_options: options
                        }
                    }
                });
            }

            const cartItem = await request(
                `/rest/V1/guest-carts/${guestCartId}/items/${targetItemId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        cartItem: itemPayload
                    })
                }
            );

            dispatch(actions.updateItem.receive({ cartItem, item, quantity }));
        } catch (error) {
            const { response, noGuestCartId } = error;

            dispatch(actions.updateItem.receive(error));

            // check if the guest cart has expired
            if (noGuestCartId || (response && response.status === 404)) {
                // if so, then delete the cached ID...
                // in contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearGuestCartId();
                // then create a new one
                await dispatch(createGuestCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }

        await Promise.all([
            dispatch(toggleDrawer('cart')),
            dispatch(getCartDetails({ forceRefresh: true }))
        ]);
        // This is done here as a dispatch instead of as part of
        // updateItem.receive() so that the cart will close the options
        // drawer only after it's finished updating
        dispatch(closeOptionsDrawer());
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
                await dispatch(createGuestCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }

        await Promise.all([dispatch(getCartDetails({ forceRefresh: true }))]);
    };
};

export const openOptionsDrawer = () => async dispatch =>
    dispatch(actions.openOptionsDrawer());

export const closeOptionsDrawer = () => async dispatch =>
    dispatch(actions.closeOptionsDrawer());

export const getCartDetails = (payload = {}) => {
    const { forceRefresh } = payload;

    return async function thunk(dispatch, getState) {
        const { cart, user } = getState();
        const { guestCartId } = cart;

        if (user.isSignedIn) {
            // TODO: handle authed carts
            // if a user creates an account,
            // then the guest cart will be transferred to their account
            // causing `/guest-carts` to 400
            return;
        }

        // if there isn't a guest cart, create one
        // then retry this operation
        if (!guestCartId) {
            await dispatch(createGuestCart());
            return thunk(...arguments);
        }

        // Once we have the cart id indicate that we are starting to make
        // async requests for the details.
        dispatch(actions.getDetails.request(guestCartId));

        try {
            const [
                imageCache,
                details,
                paymentMethods,
                totals
            ] = await Promise.all([
                retrieveImageCache(),
                fetchCartPart({ guestCartId, forceRefresh }),
                fetchCartPart({
                    guestCartId,
                    forceRefresh,
                    subResource: 'payment-methods'
                }),
                fetchCartPart({
                    guestCartId,
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
                await dispatch(createGuestCart());
                // then retry this operation
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

async function fetchCartPart({ guestCartId, forceRefresh, subResource = '' }) {
    return request(`/rest/V1/guest-carts/${guestCartId}/${subResource}`, {
        cache: forceRefresh ? 'reload' : 'default'
    });
}

export async function getGuestCartId(dispatch, getState) {
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
