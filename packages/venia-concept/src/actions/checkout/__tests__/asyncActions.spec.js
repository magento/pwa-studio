import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import actions from '../actions';
import {
    beginCheckout,
    editOrder,
    formatAddress,
    resetCheckout,
    submitInput,
    submitOrder
} from '../asyncActions';
import checkoutReceiptActions from 'src/actions/checkoutReceipt';

jest.mock('src/store');

const thunkArgs = [dispatch, getState];
const { request } = RestApi.Magento2;

const address = {
    country_id: 'US',
    firstname: 'Veronica',
    lastname: 'Costello',
    street: ['6146 Honey Bluff Parkway'],
    city: 'Calder',
    postcode: '49628-7978',
    region_id: 33,
    region_code: 'MI',
    region: 'Michigan',
    telephone: '(555) 229-3326',
    email: 'veronica@example.com'
};

const countries = [
    { id: 'US', available_regions: [{ id: 33, code: 'MI', name: 'Michigan' }] }
];

beforeAll(() => {
    getState.mockImplementation(() => ({
        cart: { guestCartId: 'GUEST_CART_ID' },
        directory: { countries }
    }));
});

afterEach(() => {
    dispatch.mockClear();
    request.mockClear();
});

afterAll(() => {
    getState.mockRestore();
});

test('beginCheckout() returns a thunk', () => {
    expect(beginCheckout()).toBeInstanceOf(Function);
});

test('beginCheckout thunk returns undefined', async () => {
    const result = await beginCheckout()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('beginCheckout thunk dispatches actions', async () => {
    await beginCheckout()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.begin());
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('resetCheckout() returns a thunk', () => {
    expect(resetCheckout()).toBeInstanceOf(Function);
});

test('resetCheckout thunk returns undefined', async () => {
    const result = await resetCheckout()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('resetCheckout thunk dispatches actions', async () => {
    await resetCheckout()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.reset());
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('editOrder() returns a thunk', () => {
    expect(editOrder()).toBeInstanceOf(Function);
});

test('editOrder thunk returns undefined', async () => {
    const result = await editOrder()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('editOrder thunk dispatches actions', async () => {
    const payload = 'PAYLOAD';
    await editOrder(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.edit(payload));
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('submitInput() returns a thunk', () => {
    expect(submitInput()).toBeInstanceOf(Function);
});

test('submitInput thunk returns undefined', async () => {
    const payload = { type: 'address', formValues: address };
    const result = await submitInput(payload)(...thunkArgs);

    expect(result).toBeUndefined();
});

test('submitInput thunk dispatches actions on success', async () => {
    const payload = { type: 'address', formValues: address };
    const response = true;

    request.mockResolvedValueOnce(response);
    await submitInput(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, actions.input.submit(payload));
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(4, actions.input.accept(response));
    expect(dispatch).toHaveBeenCalledTimes(4);
});

test('submitInput thunk dispatches actions on failure', async () => {
    const payload = { type: 'address', formValues: address };
    const error = new Error('ERROR');

    request.mockRejectedValueOnce(error);
    await submitInput(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, actions.input.submit(payload));
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(dispatch).toHaveBeenNthCalledWith(3, actions.input.reject(error));
    expect(dispatch).toHaveBeenCalledTimes(3);
});

test('submitInput thunk throws if there is no guest cart', async () => {
    const payload = { type: 'address', formValues: address };

    getState.mockImplementationOnce(() => ({
        cart: {},
        directory: { countries }
    }));

    await expect(submitInput(payload)(...thunkArgs)).rejects.toThrow(
        'guestCartId'
    );
});

test('submitInput thunk throws if payload is invalid', async () => {
    const payload = { type: 'address', formValues: {} };

    await expect(submitInput(payload)(...thunkArgs)).rejects.toThrow();
    expect(dispatch).toHaveBeenNthCalledWith(1, actions.input.submit(payload));
    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('submitOrder() returns a thunk', () => {
    expect(submitOrder()).toBeInstanceOf(Function);
});

test('submitOrder thunk returns undefined', async () => {
    const result = await submitOrder()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('submitOrder thunk dispatches actions on success', async () => {
    const response = true;

    request.mockResolvedValueOnce(response);
    await submitOrder()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        checkoutReceiptActions.setOrderInformation({
            id: response,
            billing_address: undefined
        })
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, actions.order.accept(response));
    expect(dispatch).toHaveBeenCalledTimes(3);
});

test('submitOrder thunk dispatches actions on failure', async () => {
    const error = new Error('ERROR');

    request.mockRejectedValueOnce(error);
    await submitOrder()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.order.reject(error));
    expect(dispatch).toHaveBeenCalledTimes(2);
});

test('submitOrder thunk throws if there is no guest cart', async () => {
    getState.mockImplementationOnce(() => ({
        cart: {},
        directory: { countries }
    }));

    await expect(submitOrder()(...thunkArgs)).rejects.toThrow('guestCartId');
});

test('formatAddress throws if countries does not include country_id', () => {
    const shouldThrow = () => formatAddress();

    expect(shouldThrow).toThrow();
});

test('formatAddress returns a new object', () => {
    const result = formatAddress(address, countries);

    expect(result).toEqual(address);
    expect(result).not.toBe(address);
});

test('formatAddress looks up and adds region data', () => {
    const values = { region_code: address.region_code };
    const result = formatAddress(values, countries);

    expect(result).toHaveProperty('region', address.region);
    expect(result).toHaveProperty('region_id', address.region_id);
    expect(result).toHaveProperty('region_code', address.region_code);
});

test('formatAddress throws if country is not found', () => {
    const shouldThrow = () => formatAddress();

    expect(shouldThrow).toThrow('country');
});

test('formatAddress throws if country contains no regions', () => {
    const values = { region_code: address.region_code };
    const countries = [{ id: 'US' }];
    const shouldThrow = () => formatAddress(values, countries);

    expect(shouldThrow).toThrow('regions');
});

test('formatAddress throws if region is not found', () => {
    const values = { region_code: '|||' };
    const shouldThrow = () => formatAddress(values, countries);

    expect(shouldThrow).toThrow('region');
});
