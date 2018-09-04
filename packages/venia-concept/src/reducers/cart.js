import debounce from 'lodash.debounce';

import BrowserPersistence from 'src/util/simplePersistence';

export default async function makeCartReducer() {
    const storage = new BrowserPersistence();
    const imagesBySku = (await storage.getItem('imagesBySku')) || {};
    const saveImagesBySkuCache = debounce(
        () => storage.setItem('imagesBySku', imagesBySku),
        1000
    );
    const guestCartId = await storage.getItem('guestCartId');
    const getInitialState = () => ({
        guestCartId,
        details: { items: [] },
        totals: {}
    });
    const reducer = (state = getInitialState(), { error, payload, type }) => {
        switch (type) {
            case 'CREATE_GUEST_CART': {
                // don't await the save, it can happen in the background
                storage.setItem('guestCartId', payload);
                return {
                    ...state,
                    guestCartId: payload
                };
            }
            case 'GET_CART_DETAILS': {
                return {
                    ...state,
                    ...payload,
                    details: {
                        ...payload.details,
                        items: payload.details.items.map(item => ({
                            ...item,
                            image: item.image || imagesBySku[item.sku] || ''
                        }))
                    }
                };
            }
            case 'GET_SHIPPING_METHODS': {
                return {
                    ...state,
                    ...payload,
                    shippingMethods: payload.shippingMethods.map(method => ({
                        ...method,
                        code: method.carrier_code,
                        title: method.carrier_title
                    }))
                };
            }

            case 'ADD_ITEM_TO_CART': {
                // cart items don't have images in the REST API;
                // this is the most efficient way to manage that,
                // but it should go in a data layer
                const { item } = payload;
                const media = item.media_gallery_entries || [];
                const cartImage =
                    media.find(image => image.position === 1) || media[0];
                if (
                    item.sku &&
                    cartImage &&
                    imagesBySku[item.sku] !== cartImage
                ) {
                    imagesBySku[item.sku] = cartImage;
                    // don't await the save, it can happen in the background
                    saveImagesBySkuCache();
                }
                return {
                    ...state,
                    showError: error
                };
            }
            case 'ACCEPT_ORDER': {
                storage.removeItem('guestCartId');
                return {
                    ...getInitialState(),
                    guestCartId: null
                };
            }
            default: {
                return state;
            }
        }
    };
    reducer.selectAppState = ({ cart }) => ({ cart });
    return reducer;
}
