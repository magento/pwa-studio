import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import checkoutActions from 'src/actions/checkout';
import { mockGetItem, mockSetItem } from 'src/util/simplePersistence';
import actions from '../actions';
import {
    addItemToCart,
    createGuestCart,
    getCartDetails,
    toggleCart
} from '../asyncActions';

jest.mock('src/store');
jest.mock('src/util/simplePersistence');

const thunkArgs = [dispatch, getState];
const { request } = RestApi.Magento2;

beforeAll(() => {
    getState.mockImplementation(() => ({
        app: { drawer: null },
        cart: { guestCartId: 'GUEST_CART_ID' }
    }));
});

afterEach(() => {
    dispatch.mockClear();
    request.mockClear();
});

afterAll(() => {
    getState.mockRestore();
});

test('createGuestCart() returns a thunk', () => {
    expect(createGuestCart()).toBeInstanceOf(Function);
});

test('createGuestCart thunk returns undefined', async () => {
    const result = await createGuestCart()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('createGuestCart thunk does nothing if a guest cart exists', async () => {
    await createGuestCart()(...thunkArgs);

    expect(dispatch).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
});

test('createGuestCart thunk uses the guest cart from storage', async () => {
    const storedGuestCartId = 'STORED_GUEST_CART_ID';
    getState.mockImplementationOnce(() => ({ cart: {} }));
    mockGetItem.mockImplementationOnce(() => storedGuestCartId);

    await createGuestCart()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.getGuestCart.receive(storedGuestCartId)
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(request).not.toHaveBeenCalled();
});

test('createGuestCart thunk dispatches actions on success', async () => {
    const response = 'NEW_GUEST_CART_ID';

    request.mockResolvedValueOnce(response);
    getState.mockImplementationOnce(() => ({ cart: {} }));

    await createGuestCart()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.getGuestCart.request());
    expect(dispatch).toHaveBeenNthCalledWith(
        3,
        actions.getGuestCart.receive(response)
    );
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(mockSetItem).toHaveBeenCalled();
});

test('createGuestCart thunk dispatches actions on failure', async () => {
    const error = new Error('ERROR');

    request.mockResolvedValueOnce(error);
    getState.mockImplementationOnce(() => ({ cart: {} }));

    await createGuestCart()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, checkoutActions.reset());
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.getGuestCart.request());
    expect(dispatch).toHaveBeenNthCalledWith(
        3,
        actions.getGuestCart.receive(error)
    );
    expect(dispatch).toHaveBeenCalledTimes(3);
});

test('addItemToCart() returns a thunk', () => {
    expect(addItemToCart()).toBeInstanceOf(Function);
});

test('addItemToCart thunk returns undefined', async () => {
    const result = await addItemToCart()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('addItemToCart thunk dispatches actions on success', async () => {
    const payload = { item: 'ITEM', quantity: 1 };
    const cartItem = 'CART_ITEM';

    request.mockResolvedValueOnce(cartItem);
    await addItemToCart(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.addItem.request(payload)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.addItem.receive({ cartItem, ...payload })
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
    expect(dispatch).toHaveBeenCalledTimes(4);
});

test('addItemToCart thunk dispatches actions on failure', async () => {
    const payload = { item: 'ITEM', quantity: 1 };
    const error = new Error('ERROR');

    request.mockRejectedValueOnce(error);
    await addItemToCart(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.addItem.request(payload)
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.addItem.receive(error));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
    expect(dispatch).toHaveBeenCalledTimes(4);
});

test('getCartDetails() returns a thunk', () => {
    expect(getCartDetails()).toBeInstanceOf(Function);
});

test('getCartDetails thunk returns undefined', async () => {
    const result = await getCartDetails()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('getCartDetails thunk dispatches actions on success', async () => {
    request.mockResolvedValueOnce(1);
    request.mockResolvedValueOnce(2);

    await getCartDetails()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.getDetails.request('GUEST_CART_ID')
    );
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.getDetails.receive({ details: 1, totals: 2 })
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('getCartDetails thunk dispatches actions on failure', async () => {
    const error = new Error('ERROR');
    request.mockRejectedValueOnce(error);

    await getCartDetails()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.getDetails.request('GUEST_CART_ID')
    );
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.getDetails.receive(error)
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('getCartDetails thunk merges cached item images into details', async () => {
    const cache = { SKU_1: 'IMAGE_1' };
    const items = [{ image: 'IMAGE_0', sku: 'SKU_0' }, { sku: 'SKU_1' }];
    const expected = [items[0], { ...items[1], image: cache.SKU_1 }];

    mockGetItem.mockResolvedValueOnce(cache);
    request.mockResolvedValueOnce({ items });
    request.mockResolvedValueOnce(2);

    await getCartDetails()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.getDetails.receive({ details: { items: expected }, totals: 2 })
    );
});

test('toggleCart() returns a thunk', () => {
    expect(toggleCart()).toBeInstanceOf(Function);
});

test('toggleCart thunk returns undefined', async () => {
    const result = await toggleCart()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('toggleCart thunk exits if app state is not present', async () => {
    getState.mockImplementationOnce(() => ({ cart: {} }));

    await toggleCart()(...thunkArgs);

    expect(dispatch).not.toHaveBeenCalled();
});

test('toggleCart thunk exits if cart state is not present', async () => {
    getState.mockImplementationOnce(() => ({ app: {} }));

    await toggleCart()(...thunkArgs);

    expect(dispatch).not.toHaveBeenCalled();
});

test('toggleCart thunk opens the drawer and refreshes the cart', async () => {
    await toggleCart()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(dispatch).toHaveBeenCalledTimes(2);
});
