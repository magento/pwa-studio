import { RestApi } from '@magento/peregrine';

import { store } from 'src';
import { mockGetItem, mockSetItem } from 'src/util/simplePersistence';
import checkoutActions from 'src/actions/checkout';
import actions from '../actions';
import { addItemToCart, createGuestCart } from '../asyncActions';

jest.mock('src');
jest.mock('src/util/simplePersistence');

const { dispatch, getState } = store;
const thunkArgs = [dispatch, getState];
const { request } = RestApi.Magento2;

beforeAll(() => {
    getState.mockImplementation(() => ({
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
        actions.receiveGuestCart(storedGuestCartId)
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
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.requestGuestCart());
    expect(dispatch).toHaveBeenNthCalledWith(
        3,
        actions.receiveGuestCart(response)
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
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.requestGuestCart());
    expect(dispatch).toHaveBeenNthCalledWith(
        3,
        actions.receiveGuestCart(error)
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
        actions.addItem({ cartItem, ...payload })
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenCalledTimes(3);
});
