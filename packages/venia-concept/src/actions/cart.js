import { toggleDrawer } from 'src/actions/app';

const createGuestCart = async dispatch => {
    let payload, error;
    try {
        const response = await fetch('/rest/V1/guest-carts', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(
                `Failed to create guest cart: ${response.status} ${
                    response.statusText
                }`
            );
        }
        payload = await response.json();
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

export const addItemToCart = ({
    guestCartId,
    item,
    quantity
}) => async dispatch => {
    if (!guestCartId) {
        guestCartId = await createGuestCart(dispatch);
    }
    let payload, error;
    try {
        const response = await fetch(
            `/rest/V1/guest-carts/${guestCartId}/items`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                },
                credentials: 'include',
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
        if (!response.ok) {
            throw new Error(
                `Failed to add item to cart: ${response.status} ${
                    response.statusText
                }`
            );
        }
        payload = {
            cartItem: await response.json(),
            item,
            quantity
        };
    } catch (e) {
        payload = e;
        error = true;
    }
    dispatch({
        type: 'ADD_ITEM_TO_CART',
        payload,
        error
    });
    await getCartDetails({ guestCartId })(dispatch);
    await toggleCart()(dispatch);
};

const fetchCartDetail = async guestCartId => {
    const response = await fetch(`/rest/V1/guest-carts/${guestCartId}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(
            `Failed to get cart details: ${response.status} ${
                response.statusText
            }`
        );
    }
    return response.json();
};

const fetchCartTotals = async guestCartId => {
    const response = await fetch(`/rest/V1/guest-carts/${guestCartId}/totals`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error(
            `Failed to get cart totals: ${response.status} ${
                response.statusText
            }`
        );
    }
    return response.json();
};

export const getCartDetails = ({ guestCartId }) => async dispatch => {
    if (!guestCartId) {
        guestCartId = await createGuestCart(dispatch);
    }
    let payload, error;
    try {
        const [details, totals] = await Promise.all([
            fetchCartDetail(guestCartId),
            fetchCartTotals(guestCartId)
        ]);
        payload = {
            details,
            totals
        };
    } catch (e) {
        payload = e;
        error = true;
    }
    dispatch({
        type: 'GET_CART_DETAILS',
        payload,
        error
    });
};

export const toggleCart = () => toggleDrawer('cart');
