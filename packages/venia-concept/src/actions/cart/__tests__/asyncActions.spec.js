import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import checkoutActions from 'src/actions/checkout';
import {
    mockGetItem,
    mockSetItem,
    mockRemoveItem
} from '@magento/util/simplePersistence';
import actions from '../actions';
import {
    addItemToCart,
    updateItemInCart,
    removeItemFromCart,
    createCart,
    getCartDetails,
    removeCart,
    toggleCart,
    writeImageToCache
} from '../asyncActions';

jest.mock('src/store');

const thunkArgs = [dispatch, getState];
const { request } = RestApi.Magento2;

beforeAll(() => {
    getState.mockImplementation(() => ({
        app: { drawer: null },
        cart: { cartId: 'CART_ID' },
        user: { isSignedIn: false }
    }));
});

afterEach(() => {
    dispatch.mockClear();
    request.mockClear();
    getState.mockClear();
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
});

afterAll(() => {
    getState.mockRestore();
});

describe('createCart', () => {
    test('it returns a thunk', () => {
        expect(createCart()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));

        const result = await createCart()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk earlies out if a cartId already exists in state', async () => {
        await createCart()(...thunkArgs);

        expect(dispatch).not.toHaveBeenCalled();
        expect(request).not.toHaveBeenCalled();
    });

    test('its thunk uses the cart from storage', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));
        const storedCartId = 'STORED_CART_ID';
        mockGetItem.mockImplementationOnce(() => storedCartId);

        await createCart()(...thunkArgs);

        expect(mockGetItem).toHaveBeenCalledWith('cartId');
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.getCart.request());
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.getCart.receive(storedCartId)
        );

        expect(request).not.toHaveBeenCalled();
    });

    test('its thunk does not use the cart id from storage if the user is logged in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: true }
        }));
        const storedCartId = 'STORED_CART_ID';
        mockGetItem.mockImplementationOnce(() => storedCartId);
        const responseMock = 1234;
        request.mockResolvedValueOnce(responseMock);

        await createCart()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.getCart.request());
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.getCart.receive(responseMock)
        );

        expect(request).toHaveBeenCalled();
    });

    test('its thunk dispatches actions on success', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));
        const response = 'NEW_CART_ID';
        request.mockResolvedValueOnce(response);

        await createCart()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.getCart.request());
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.getCart.receive(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(mockSetItem).toHaveBeenCalledWith('cartId', response);
    });

    test('its thunk calls the appropriate endpoints when user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: true }
        }));
        const response = 'NEW_CART_ID';
        request.mockResolvedValueOnce(response);

        await createCart()(...thunkArgs);

        expect(request).toHaveBeenCalledTimes(2);

        const authedEndpoint = '/rest/V1/carts/mine';
        expect(request).toHaveBeenNthCalledWith(1, authedEndpoint, {
            method: 'POST'
        });

        const billingEndpoint = '/rest/V1/carts/mine/billing-address';
        expect(request).toHaveBeenNthCalledWith(2, billingEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                address: {},
                cartId: response
            })
        });
    });

    test('its thunk dispatches actions on failure', async () => {
        mockGetItem.mockImplementationOnce(() => {});
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));
        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        await createCart()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.getCart.request());
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.getCart.receive(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);
    });
});

describe('addItemToCart', () => {
    const payload = { item: 'ITEM', quantity: 1 };

    test('it returns a thunk', () => {
        expect(addItemToCart()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await addItemToCart()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    // test('addItemToCart thunk dispatches actions on success', async () => {
    //     const payload = { item: 'ITEM', quantity: 1 };
    //     const cartItem = 'CART_ITEM';

    //     request.mockResolvedValueOnce(cartItem);
    //     await addItemToCart(payload)(...thunkArgs);

    //     expect(dispatch).toHaveBeenNthCalledWith(
    //         1,
    //         actions.addItem.request(payload)
    //     );
    //     expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    //     expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    //     expect(dispatch).toHaveBeenNthCalledWith(
    //         4,
    //         actions.addItem.receive({ cartItem, ...payload })
    //     );
    //     expect(dispatch).toHaveBeenCalledTimes(4);
    // });

    test('its thunk dispatches actions on success', async () => {
        // Test setup.
        const cartItem = 'CART_ITEM';
        request.mockResolvedValueOnce(cartItem);

        // Call the function.
        await addItemToCart(payload)(...thunkArgs);

        // Make assertions.
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.addItem.request(payload)
        );
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
        // toggleDrawer
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(
            4,
            actions.addItem.receive({
                cartItem,
                item: payload.item,
                quantity: payload.quantity
            })
        );
        expect(dispatch).toHaveBeenCalledTimes(4);
    });

    // test('it calls writeImageToCache', async () => {
    //     writeImageToCache.mockImplementationOnce(() => {});

    //     await updateItemInCart(payload)(...thunkArgs);

    //     expect(writeImageToCache).toHaveBeenCalled();
    // });

    test('its thunk dispatches special failure if cartId is not present', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {
                /* Purposefully no cartId here */
            },
            user: { isSignedIn: false }
        }));

        const error = new Error('Missing required information: cartId');
        error.noCartId = true;

        await addItemToCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.addItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.addItem.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    });

    test('its thunk tries to recreate a cart on 404 failure', async () => {
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);

        await addItemToCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(8);

        /*
         * Initial attempt will fail.
         */

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.addItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.addItem.receive(error)
        );
        // removeCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));

        /*
         * And then the thunk is called again.
         */

        expect(dispatch).toHaveBeenNthCalledWith(
            5,
            actions.addItem.request(payload)
        );
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(6, expect.any(Function));
        // toggleDrawer
        expect(dispatch).toHaveBeenNthCalledWith(7, expect.any(Function));
        // addItem.receive
        expect(dispatch).toHaveBeenNthCalledWith(
            8,
            actions.addItem.receive({
                cartItem: undefined,
                item: 'ITEM',
                quantity: 1
            })
        );
    });

    test('its thunk uses the appropriate endpoint when user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: { cartId: 'SOME_CART_ID' },
            user: { isSignedIn: true }
        }));

        await addItemToCart(payload)(...thunkArgs);

        const authedEndpoint = '/rest/V1/carts/mine/items';
        expect(request).toHaveBeenCalledWith(authedEndpoint, {
            method: 'POST',
            body: expect.any(String)
        });
    });
});

describe('removeItemFromCart', () => {
    const payload = { item: { item_id: 1 } };

    test('it returns a thunk', () => {
        expect(removeItemFromCart(payload)).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await removeItemFromCart(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        const response = 1;
        request.mockResolvedValueOnce(response);

        await removeItemFromCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.removeItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.removeItem.receive({
                cartItem: response,
                item: payload.item,
                cartItemCount: 0
            })
        );
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    });

    test('its thunk dispatches special failure if cartId is not present', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));

        const error = new Error('Missing required information: cartId');
        error.noCartId = true;

        await removeItemFromCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.removeItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.removeItem.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));

        expect(mockRemoveItem).toHaveBeenCalledWith('cartId');
    });

    test('its thunk tries to recreate a cart on 404 failure', async () => {
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);

        await removeItemFromCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.removeItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.removeItem.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
    });

    test('its thunk retries the operation on 404 error when the user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            app: { drawer: null },
            cart: { cartId: 'CART_ID' },
            user: { isSignedIn: true }
        }));
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);

        await removeItemFromCart(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(6);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.removeItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.removeItem.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));

        /*
         *  The operation is now retried.
         */
        expect(dispatch).toHaveBeenNthCalledWith(
            4,
            actions.removeItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            5,
            actions.removeItem.receive({
                cartItem: undefined,
                item: payload.item,
                cartItemCount: 0
            })
        );

        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(6, expect.any(Function));
    });

    test('its thunk clears the cartId when removing the last item in the cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: { cartId: 'CART', details: { items_count: 1 } },
            user: { isSignedIn: false }
        }));

        await removeItemFromCart(payload)(...thunkArgs);

        expect(mockRemoveItem).toHaveBeenCalledWith('cartId');
    });

    test('its thunk uses the proper endpoint when user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: { cartId: 'UNIT_TEST' },
            user: { isSignedIn: true }
        }));

        await removeItemFromCart(payload)(...thunkArgs);

        const authedEndpoint = `/rest/V1/carts/mine/items/${
            payload.item.item_id
        }`;
        expect(request).toHaveBeenCalledWith(authedEndpoint, {
            method: 'DELETE'
        });
    });
});

describe('updateItemInCart', () => {
    const payload = {
        item: { item_id: 1 },
        quantity: 1
    };
    const targetItemId = 2;

    test('it returns a thunk', () => {
        expect(updateItemInCart(payload, targetItemId)).toBeInstanceOf(
            Function
        );
    });

    test('its thunk returns undefined', async () => {
        const result = await updateItemInCart(payload, targetItemId)(
            ...thunkArgs
        );

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        const response = 7;
        request.mockResolvedValueOnce(response);

        await updateItemInCart(payload, targetItemId)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(4);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.updateItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.updateItem.receive({
                cartItem: response,
                item: payload.item,
                quantity: payload.quantity
            })
        );
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // closeOptionsDrawer
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
    });

    // test('it calls writeImageToCache', async () => {
    //     writeImageToCache.mockImplementationOnce(() => {});

    //     await updateItemInCart(payload, targetItemId)(...thunkArgs);

    //     expect(writeImageToCache).toHaveBeenCalled();
    // });

    test('its thunk dispatches special failure if cartId is not present', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {
                /* cartId is purposefully not present */
            },
            user: { isSignedIn: false }
        }));

        const error = new Error('Missing required information: cartId');
        error.noCartId = true;

        await updateItemInCart(payload, targetItemId)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.updateItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.updateItem.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    });

    test('its thunk tries to recreate a cart and add the updated item to it on 404 failure', async () => {
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);
        // image cache
        //mockGetItem.mockResolvedValueOnce('CACHED_CART');

        await updateItemInCart(payload, targetItemId)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(7);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.updateItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.updateItem.receive(error)
        );
        // removeCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        // addItemToCart
        expect(dispatch).toHaveBeenNthCalledWith(5, expect.any(Function));
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(6, expect.any(Function));
        // closeOptionsDrawer
        expect(dispatch).toHaveBeenNthCalledWith(7, expect.any(Function));
    });

    test('its thunk retries on 404 failure if the user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            app: { drawer: null },
            cart: { cartId: 'CART_ID' },
            user: { isSignedIn: true }
        }));
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);
        // image cache
        //mockGetItem.mockResolvedValueOnce('CACHED_CART');

        await updateItemInCart(payload, targetItemId)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(8);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.updateItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.updateItem.receive(error)
        );
        // removeCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));

        /*
         * The operation is now retried.
         */
        expect(dispatch).toHaveBeenNthCalledWith(
            5,
            actions.updateItem.request(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            6,
            actions.updateItem.receive({
                cartItem: undefined,
                item: payload.item,
                quantity: payload.quantity
            })
        );

        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(7, expect.any(Function));
        // closeOptionsDrawer
        expect(dispatch).toHaveBeenNthCalledWith(8, expect.any(Function));
    });

    test('its thunk uses the proper endpoint when the user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: { cartId: 'UNIT_TEST' },
            user: { isSignedIn: true }
        }));

        await updateItemInCart(payload, targetItemId)(...thunkArgs);

        const authedEndpoint = `/rest/V1/carts/mine/items/${targetItemId}`;
        expect(request).toHaveBeenCalledWith(authedEndpoint, {
            method: 'PUT',
            body: expect.any(String)
        });
    });
});

describe('getCartDetails', () => {
    const payload = { forceRefresh: true };

    test('it returns a thunk', () => {
        expect(getCartDetails(payload)).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await getCartDetails(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk creates a cart if no id is found', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {
                /* cartId purposefully not present */
            },
            user: { isSignedIn: false }
        }));

        await getCartDetails(payload)(...thunkArgs);

        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    });

    test('its thunk dispatches actions on success', async () => {
        const mockDetails = { items: [] };
        request
            // fetchCartPart (details)
            .mockResolvedValueOnce(mockDetails)
            // fetchCartPart (payment methods)
            .mockResolvedValueOnce(2)
            // fetchCartPart (totals)
            .mockResolvedValueOnce(3);

        await getCartDetails(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive({
                details: mockDetails,
                paymentMethods: 2,
                totals: 3
            })
        );
    });

    test('its thunk dispatches actions on failure', async () => {
        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        await getCartDetails(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive(error)
        );
    });

    test('its thunk tries to recreate a cart on 404 failure', async () => {
        const error = new Error('ERROR');
        error.response = {
            status: 404
        };
        request.mockRejectedValueOnce(error);

        await getCartDetails(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive(error)
        );
        // createCart
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));

        // And then the thunk is called again.

        // three (3) fetchCartParts x two (2) thunk calls (initial, then the retry) = 6.
        expect(request).toHaveBeenCalledTimes(6);
    });

    test('its thunk merges cached item images into details', async () => {
        // Mock getting the image cache from storage.
        const cache = { SKU_1: 'IMAGE_1' };
        mockGetItem.mockResolvedValueOnce(cache);

        const items = [
            { image: 'IMAGE_0', sku: 'SKU_0' },
            { sku: 'SKU_1' },
            { sku: 'SKU_2' }
        ];
        const expected = [
            items[0],
            { ...items[1], image: cache.SKU_1, options: [] },
            { ...items[2], image: {}, options: [] }
        ];
        const mockDetails = { items };
        request
            // fetchCartPart (details)
            .mockResolvedValueOnce(mockDetails)
            // fetchCartPart (payment methods)
            .mockResolvedValueOnce(2)
            // fetchCartPart (totals)
            .mockResolvedValueOnce(3);

        await getCartDetails(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive({
                details: { items: expected },
                paymentMethods: 2,
                totals: 3
            })
        );
    });

    test('its thunk uses the proper endpoint when the user is signed in', async () => {
        getState.mockImplementationOnce(() => ({
            cart: { cartId: 'UNIT_TEST' },
            user: { isSignedIn: true }
        }));

        await getCartDetails(payload)(...thunkArgs);

        const authedEndpoints = {
            details: '/rest/V1/carts/mine/',
            paymentMethods: '/rest/V1/carts/mine/payment-methods',
            totals: '/rest/V1/carts/mine/totals'
        };
        const cacheArg = expect.any(Object);
        expect(request).toHaveBeenNthCalledWith(
            1,
            authedEndpoints.details,
            cacheArg
        );
        expect(request).toHaveBeenNthCalledWith(
            2,
            authedEndpoints.paymentMethods,
            cacheArg
        );
        expect(request).toHaveBeenNthCalledWith(
            3,
            authedEndpoints.totals,
            cacheArg
        );
    });
});

describe('removeCart', () => {
    test('it returns a thunk', () => {
        expect(removeCart()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await removeCart()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('it clears the cartId from local storage', async () => {
        await removeCart()(...thunkArgs);

        expect(mockRemoveItem).toHaveBeenCalledWith('cartId');
    });

    test('it clears the cart from the redux store', async () => {
        await removeCart()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(actions.reset());
    });
});

describe('toggleCart', () => {
    test('it returns a thunk', () => {
        expect(toggleCart()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await toggleCart()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk exits if app state is not present', async () => {
        getState.mockImplementationOnce(() => ({
            /* app is purposefully not present */
            cart: {}
        }));

        await toggleCart()(...thunkArgs);

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('its thunk exits if cart state is not present', async () => {
        getState.mockImplementationOnce(() => ({
            app: {}
            /* cart is purposefully not present */
        }));

        await toggleCart()(...thunkArgs);

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('its thunk closes the drawer if it is open', async () => {
        getState.mockImplementationOnce(() => ({
            app: { drawer: 'cart' },
            cart: {}
        }));

        await toggleCart()(...thunkArgs);

        const closeDrawer = expect.any(Function);
        expect(dispatch).toHaveBeenNthCalledWith(1, closeDrawer);
    });

    test('its thunk opens the drawer and refreshes the cart', async () => {
        await toggleCart()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        const toggleDrawer = expect.any(Function);
        expect(dispatch).toHaveBeenNthCalledWith(1, toggleDrawer);
        const getCartDetails = expect.any(Function);
        expect(dispatch).toHaveBeenNthCalledWith(2, getCartDetails);
    });
});

describe('writeImageToCache', () => {
    test('it does nothing when the item has no sku', async () => {
        const noSku = {
            media_gallery_entries: [
                {
                    position: 1,
                    url: 'http://example.com'
                }
            ]
        };

        await writeImageToCache(noSku);

        expect(mockGetItem).not.toHaveBeenCalled();
    });

    test('it does nothing when the item is missing entries', async () => {
        const noImages = {
            sku: 'INVISIBLE'
            /* media_gallery_entries is purposefully omitted */
        };

        await writeImageToCache(noImages);

        expect(mockGetItem).not.toHaveBeenCalled();
    });

    test('it does nothing when the item has zero entries', async () => {
        const emptyImages = {
            sku: 'INVISIBLE',
            media_gallery_entries: []
        };

        await addItemToCart(emptyImages);

        expect(mockGetItem).not.toHaveBeenCalled();
    });

    test('it stores product images in local cache when they have positions', async () => {
        const item = {
            sku: 'HELLO',
            media_gallery_entries: [
                {
                    position: 2,
                    url: 'http://example.com/second'
                },
                {
                    position: 1,
                    url: 'http://example.com/first'
                }
            ]
        };

        await writeImageToCache(item);

        expect(mockGetItem).toHaveBeenCalledWith('imagesBySku');
        expect(mockSetItem).toHaveBeenCalledWith(
            'imagesBySku',
            expect.objectContaining({
                HELLO: { position: 1, url: 'http://example.com/first' }
            })
        );
    });

    test('it stores product images when they do not have positions', async () => {
        // With unpositioned images.
        const itemWithUnpositionedImages = {
            sku: 'GOODBYE',
            media_gallery_entries: [
                {
                    url: 'http://example.com'
                }
            ]
        };

        await writeImageToCache(itemWithUnpositionedImages);

        expect(mockGetItem).toHaveBeenCalledWith('imagesBySku');
        expect(mockSetItem).toHaveBeenCalledWith(
            'imagesBySku',
            expect.objectContaining({
                GOODBYE: { url: 'http://example.com' }
            })
        );
    });

    test('it reuses product images from cache', async () => {
        const sameItem = {
            sku: 'SAME_ITEM',
            media_gallery_entries: [{ url: 'http://example.com/same/item' }]
        };

        const fakeImageCache = {};
        mockGetItem
            .mockReturnValueOnce(fakeImageCache)
            .mockReturnValueOnce(fakeImageCache);

        await writeImageToCache(sameItem);
        expect(mockSetItem).toHaveBeenCalledTimes(1);

        await writeImageToCache(sameItem);
        // mockSetItem should still have only been called once.
        expect(mockSetItem).toHaveBeenCalledTimes(1);
    });
});
