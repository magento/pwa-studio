import { toggleDrawer } from 'src/actions/app';
import { RestApi } from '@magento/peregrine';
const {
    Magento2: { request }
} = RestApi;

const createGuestCart = async dispatch => {
    const payload = await request({ method: 'POST', path: 'guest-carts' });
    dispatch({
        type: 'CREATE_GUEST_CART',
        payload
    });
    return payload;
};

export const addItemToCart = ({
    guestCartId,
    item,
    quantity
}) => async dispatch => {
    if (!guestCartId) {
        guestCartId = await createGuestCart(dispatch);
    }
    const cartItem = await request({
        method: 'POST',
        path: `guest-carts/${guestCartId}/items`,
        body: JSON.stringify({
            cartItem: {
                qty: quantity,
                sku: item.sku,
                name: item.name,
                quote_id: guestCartId
            }
        })
    });
    dispatch({
        type: 'ADD_ITEM_TO_CART',
        payload: {
            cartItem,
            item,
            quantity
        }
    });
    await getCartDetails({ guestCartId, forceRefresh: true })(dispatch);
    await toggleCart()(dispatch);
};

export const getCartDetails = ({
    guestCartId,
    forceRefresh
} = {}) => async dispatch => {
    if (!guestCartId) {
        guestCartId = await createGuestCart(dispatch);
    }
    const options = {
        rolling: forceRefresh
    };
    const [details, totals] = await Promise.all([
        request({
            method: 'GET',
            path: `guest-carts/${guestCartId}`,
            ...options
        }),
        request({
            method: 'GET',
            path: `guest-carts/${guestCartId}/totals`,
            ...options
        })
    ]);
    dispatch({
        type: 'GET_CART_DETAILS',
        payload: {
            details,
            totals
        }
    });
};

export const toggleCart = () => toggleDrawer('cart');
