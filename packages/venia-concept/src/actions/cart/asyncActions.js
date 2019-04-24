import { RestApi, Util } from '@magento/peregrine';

import { closeDrawer, toggleDrawer } from 'src/actions/app';
import checkoutActions from 'src/actions/checkout';
import actions from './actions';

const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const createCart = () =>
    async function thunk(dispatch, getState) {
        const { cart, user } = getState();

        // if a cart already exists in the store, exit
        if (cart.cartId) {
            return;
        }

        // reset the checkout workflow
        // in case the user has already completed an order this session
        dispatch(checkoutActions.reset());

        // Request a new cart.
        dispatch(actions.getCart.request());

        // if a cart exists in storage, act like we just received it
        const cartId = await retrieveCartId();
        if (cartId && !user.isSignedIn) {
            dispatch(actions.getCart.receive(cartId));
            return;
        }

        try {
            const guestCartEndpoint = '/rest/V1/guest-carts';
            const signedInCartEndpoint = '/rest/V1/carts/mine';
            const cartEndpoint = user.isSignedIn
                ? signedInCartEndpoint
                : guestCartEndpoint;

            const cartId = await request(cartEndpoint, {
                method: 'POST'
            });

            // write to storage in the background
            saveCartId(cartId);

            // There is currently an issue in Magento 2
            // where the first item added to an empty cart for an
            // authenticated customer gets added with a price of zero.
            // @see https://github.com/magento/magento2/issues/2991
            // This workaround is in place until that issue is resolved.
            if (user.isSignedIn) {
                await request('/rest/V1/carts/mine/billing-address', {
                    method: 'POST',
                    body: JSON.stringify({
                        address: {},
                        cartId
                    })
                });
            }

            dispatch(actions.getCart.receive(cartId));
        } catch (error) {
            dispatch(actions.getCart.receive(error));
        }
    };

export const addItemToCart = (payload = {}) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.addItem.request(payload));

        try {
            const { cart, user } = getState();
            const { cartId } = cart;

            if (!cartId) {
                const missingCartIdError = new Error(
                    'Missing required information: cartId'
                );
                missingCartIdError.noCartId = true;
                throw missingCartIdError;
            }

            const cartItem = toRESTCartItem(cartId, payload);

            const { isSignedIn } = user;
            const guestCartEndpoint = `/rest/V1/guest-carts/${cartId}/items`;
            const signedInCartEndpoint = '/rest/V1/carts/mine/items';
            const cartEndpoint = isSignedIn
                ? signedInCartEndpoint
                : guestCartEndpoint;

            const response = await request(cartEndpoint, {
                method: 'POST',
                body: JSON.stringify({ cartItem })
            });

            // 2019-02-07  Moved these dispatches to the success clause of
            // addItemToCart. The cart should only open on success.
            // In the catch clause, this action creator calls its own thunk,
            // so a successful retry will wind up here anyway.
            await dispatch(getCartDetails({ forceRefresh: true }));
            await dispatch(toggleDrawer('cart'));
            dispatch(
                actions.addItem.receive({ cartItem: response, item, quantity })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.addItem.receive(error));

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                // Delete the cached ID from local storage and Redux.
                // In contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await dispatch(removeCart());
                // then create a new one
                await dispatch(createCart());
                // then retry this operation
                return thunk(...arguments);
            }
        }
    };
};

export const updateItemInCart = (payload = {}, targetItemId) => {
    const { item, quantity } = payload;
    const writingImageToCache = writeImageToCache(item);

    return async function thunk(dispatch, getState) {
        await writingImageToCache;
        dispatch(actions.updateItem.request(payload));

        const { cart, user } = getState();

        try {
            const { cartId } = cart;

            if (!cartId) {
                const missingCartIdError = new Error(
                    'Missing required information: cartId'
                );
                missingCartIdError.noCartId = true;
                throw missingCartIdError;
            }

            const cartItem = toRESTCartItem(cartId, payload);

            const { isSignedIn } = user;
            const guestCartEndpoint = `/rest/V1/guest-carts/${cartId}/items/${targetItemId}`;
            const signedInCartEndpoint = `/rest/V1/carts/mine/items/${targetItemId}`;
            const cartEndpoint = isSignedIn
                ? signedInCartEndpoint
                : guestCartEndpoint;

            const response = await request(cartEndpoint, {
                method: 'PUT',
                body: JSON.stringify({ cartItem })
            });

            dispatch(
                actions.updateItem.receive({
                    cartItem: response,
                    item,
                    quantity
                })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.updateItem.receive(error));

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                // Delete the cached ID from local storage and Redux.
                // In contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await dispatch(removeCart());
                // then create a new one
                await dispatch(createCart());

                if (user.isSignedIn) {
                    // The user is signed in and we just received their cart.
                    // Retry this operation.
                    return thunk(...arguments);
                } else {
                    // The user is a guest and just received a brand new (empty) cart.
                    // Add the updated item to that cart.
                    await dispatch(addItemToCart(payload));
                }
            }
        }

        await dispatch(getCartDetails({ forceRefresh: true }));

        // Close the options drawer only after the cart is finished updating.
        dispatch(closeOptionsDrawer());
    };
};

export const removeItemFromCart = payload => {
    const { item } = payload;

    return async function thunk(dispatch, getState) {
        dispatch(actions.removeItem.request(payload));

        const { cart, user } = getState();

        try {
            const { cartId } = cart;

            if (!cartId) {
                const missingCartIdError = new Error(
                    'Missing required information: cartId'
                );
                missingCartIdError.noCartId = true;
                throw missingCartIdError;
            }

            const { isSignedIn } = user;
            const guestCartEndpoint = `/rest/V1/guest-carts/${cartId}/items/${
                item.item_id
            }`;
            const signedInCartEndpoint = `/rest/V1/carts/mine/items/${
                item.item_id
            }`;
            const cartEndpoint = isSignedIn
                ? signedInCartEndpoint
                : guestCartEndpoint;

            const response = await request(cartEndpoint, {
                method: 'DELETE'
            });

            // When removing the last item in the cart, perform a reset
            // to prevent a bug where the next item added to the cart has
            // a price of 0
            const cartItemCount = cart.details ? cart.details.items_count : 0;
            if (cartItemCount === 1) {
                await clearCartId();
            }

            dispatch(
                actions.removeItem.receive({
                    cartItem: response,
                    item,
                    cartItemCount
                })
            );
        } catch (error) {
            const { response, noCartId } = error;

            dispatch(actions.removeItem.receive(error));

            // check if the cart has expired
            if (noCartId || (response && response.status === 404)) {
                // Delete the cached ID from local storage.
                // The reducer handles clearing out the bad ID from Redux.
                // In contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearCartId();
                // then create a new one
                await dispatch(createCart());

                if (user.isSignedIn) {
                    // The user is signed in and we just received their cart.
                    // Retry this operation.
                    return thunk(...arguments);
                }

                // Else the user is a guest and just received a brand new (empty) cart.
                // We don't retry because we'd be attempting to remove an item
                // from an empty cart.
            }
        }

        await dispatch(getCartDetails({ forceRefresh: true }));
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
        const { cartId } = cart;
        const { isSignedIn } = user;

        // if there isn't a cart, create one
        // then retry this operation
        if (!cartId) {
            await dispatch(createCart());
            return thunk(...arguments);
        }

        // Once we have the cart id indicate that we are starting to make
        // async requests for the details.
        dispatch(actions.getDetails.request(cartId));

        try {
            const [
                imageCache,
                details,
                paymentMethods,
                totals
            ] = await Promise.all([
                retrieveImageCache(),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn
                }),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn,
                    subResource: 'payment-methods'
                }),
                fetchCartPart({
                    cartId,
                    forceRefresh,
                    isSignedIn,
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

            // check if the cart has expired
            if (response && response.status === 404) {
                // if so, then delete the cached ID from local storage.
                // The reducer handles clearing out the bad ID from Redux.
                // In contrast to the save, make sure storage deletion is
                // complete before dispatching the error--you don't want an
                // upstream action to try and reuse the known-bad ID.
                await clearCartId();
                // then create a new one
                await dispatch(createCart());
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

export const removeCart = () =>
    async function thunk(dispatch) {
        // Clear the cartId from local storage.
        await clearCartId();

        // Clear the cart info from the redux store.
        await dispatch(actions.reset());
    };

/* helpers */

async function fetchCartPart({
    cartId,
    forceRefresh,
    isSignedIn,
    subResource = ''
}) {
    const signedInEndpoint = `/rest/V1/carts/mine/${subResource}`;
    const guestEndpoint = `/rest/V1/guest-carts/${cartId}/${subResource}`;
    const endpoint = isSignedIn ? signedInEndpoint : guestEndpoint;

    const cache = forceRefresh ? 'reload' : 'default';

    return request(endpoint, { cache });
}

export async function getCartId(dispatch, getState) {
    const { cart } = getState();

    // reducers may be added asynchronously
    if (!cart) {
        return null;
    }

    // create a cart if one hasn't been created yet
    if (!cart.cartId) {
        await dispatch(createCart());
    }

    // retrieve app state again
    return getState().cart.cartId;
}

export async function retrieveCartId() {
    return storage.getItem('cartId');
}

export async function saveCartId(id) {
    return storage.setItem('cartId', id);
}

export async function clearCartId() {
    return storage.removeItem('cartId');
}

async function retrieveImageCache() {
    return storage.getItem('imagesBySku') || {};
}

async function saveImageCache(cache) {
    return storage.setItem('imagesBySku', cache);
}

/**
 * Transforms an item payload to a shape that the REST endpoints expect.
 * When GraphQL comes online we can drop this.
 */
function toRESTCartItem(cartId, payload) {
    const { item, productType, quantity } = payload;

    const cartItem = {
        qty: quantity,
        sku: item.sku,
        name: item.name,
        quote_id: cartId
    };

    if (productType === 'ConfigurableProduct') {
        const { options, parentSku } = payload;

        cartItem.sku = parentSku;
        cartItem.product_type = 'configurable';
        cartItem.product_option = {
            extension_attributes: {
                configurable_item_options: options
            }
        };
    }

    return cartItem;
}

export async function writeImageToCache(item = {}) {
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
