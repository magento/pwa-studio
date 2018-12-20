import { RestApi } from '@magento/peregrine';

import authorizationService from 'src/services/authorization';

const { request } = RestApi.Magento2;
const { isSignedIn } = authorizationService;

const buildCartItem = (quoteId, payload) => {
    const { item, options, parentSku, productType, quantity } = payload;
    const itemPayload = {
        qty: quantity,
        sku: item.sku,
        name: item.name,
        quote_id: quoteId
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

    return itemPayload;
};

// TODO: change to GraphQL mutation
// for now, manually transform the payload for REST
const addItemToGuestCart = (guestCartId, itemPayload) =>
    request(`/rest/V1/guest-carts/${guestCartId}/items`, {
        method: 'POST',
        body: JSON.stringify({
            cartItem: itemPayload
        })
    });

const addItemToCustomerCart = itemPayload =>
    request('/rest/V1/carts/mine/items', {
        method: 'POST',
        body: JSON.stringify({
            cartItem: itemPayload
        })
    });

export const addItemToCart = (cartId, payload) => {
    const itemPayload = buildCartItem(cartId, payload);

    if (isSignedIn()) {
        return addItemToCustomerCart(itemPayload);
    }

    return addItemToGuestCart(cartId, itemPayload);
};

export const createCart = async () => {
    if (isSignedIn()) {
        const cartId = await request('/rest/V1/carts/mine', {
            method: 'POST'
        });

        // The response is a number,
        // but according to the docs quote_id parameter should be a string.
        return String(cartId);
    }

    return request('/rest/V1/guest-carts', {
        method: 'POST'
    });
};

export const fetchCartPart = ({ cartId, forceRefresh, subResource = '' }) => {
    const cache = forceRefresh ? 'reload' : 'default';
    const url = isSignedIn()
        ? `rest/V1/carts/mine/${subResource}`
        : `/rest/V1/guest-carts/${cartId}/${subResource}`;

    return request(url, {
        cache
    });
};

export const removeCartItem = ({ cartId, itemId }) => {
    const url = isSignedIn()
        ? `/rest/V1/carts/mine/items/${itemId}`
        : `/rest/V1/guest-carts/${cartId}/items/${itemId}`;

    return request(url, {
        method: 'DELETE'
    });
};
