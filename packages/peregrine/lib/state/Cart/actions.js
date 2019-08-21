import { RestApi, Util } from '@magento/peregrine';
const { request } = RestApi.Magento2;
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const AUTHED_CART_ENDPOINT = '/rest/V1/carts/mine';
const GUEST_CART_ENDPOINT = '/rest/V1/guest-carts';
const AUTHED_ITEMS_ENDPOINT = `${AUTHED_CART_ENDPOINT}/items`;

/**
 *
 * @param {Object} payload contains item, options, sku, type and quantity
 * @param {*} cartId
 * @param {*} isSignedIn
 */
export const addItemToCart = async (payload, cartId, isSignedIn) => {
    console.log('adding item to cart', payload);
    writeImageToCache(payload.item);

    const guestCartEndpoint = `/rest/V1/guest-carts/${cartId}/items`;
    const endpoint = isSignedIn ? AUTHED_ITEMS_ENDPOINT : guestCartEndpoint;

    const cartItem = toRESTCartItem(cartId, payload);

    try {
        await request(endpoint, {
            method: 'POST',
            body: JSON.stringify({ cartItem })
        });
    } catch (error) {
        console.error('Unable to add item to cart:', error);
    }
};

export const createCart = async isSignedIn => {
    const endpoint = isSignedIn ? AUTHED_CART_ENDPOINT : GUEST_CART_ENDPOINT;

    let cartId;
    try {
        cartId = await request(endpoint, {
            method: 'POST'
        });
    } catch (error) {
        throw Error('Unable to create cart:', error);
    }

    return cartId;
};

/**
 * HELPER FUNCTIONS
 */

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
