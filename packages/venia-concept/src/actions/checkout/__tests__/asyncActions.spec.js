import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import actions from '../actions';
import {
    beginCheckout,
    editOrder,
    formatAddress,
    resetCheckout,
    submitAddress,
    submitPaymentMethod,
    submitOrder,
    submitShippingMethod
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

const paymentMethod = {
    code: 'checkmo',
    title: 'Check / Money order'
};

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

describe('beginCheckout', () => {
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
});

describe('resetCheckout', () => {
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
});

describe('editOrder', () => {
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
});

describe('submitAddress', () => {
    test('submitAddress() returns a thunk', () => {
        expect(submitAddress()).toBeInstanceOf(Function);
    });

    test('submitAddress thunk returns undefined', async () => {
        const payload = { type: 'address', formValues: address };
        const result = await submitAddress(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitAddress thunk dispatches actions on success', async () => {
        const payload = { type: 'address', formValues: address };
        const response = true;

        request.mockResolvedValueOnce(response);
        await submitAddress(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.address.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(
            5,
            actions.address.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(5);
    });

    test('submitAddress thunk dispatches actions on failure', async () => {
        const payload = { type: 'address', formValues: address };
        const error = new Error('ERROR');

        request.mockRejectedValueOnce(error);
        await submitAddress(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.address.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.address.reject(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);
    });

    test('submitAddress thunk throws if there is no guest cart', async () => {
        const payload = { type: 'address', formValues: address };

        getState.mockImplementationOnce(() => ({
            cart: {},
            directory: { countries }
        }));

        await expect(submitAddress(payload)(...thunkArgs)).rejects.toThrow(
            'guestCartId'
        );
    });

    test('submitAddress thunk throws if payload is invalid', async () => {
        const payload = { type: 'address', formValues: {} };

        await expect(submitAddress(payload)(...thunkArgs)).rejects.toThrow();
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.address.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
        expect(dispatch).toHaveBeenCalledTimes(2);
    });
});

describe('submitPaymentMethod', () => {
    beforeAll(() => {
        getState.mockImplementation(() => ({
            cart: {
                guestCartId: 'GUEST_CART_ID',
                details: {
                    billing_address: address
                },
                shippingMethods: []
            },
            directory: { countries }
        }));
    });

    afterAll(() => {
        getState.mockRestore();
    });

    test('submitPaymentMethod() returns a thunk', () => {
        expect(submitPaymentMethod()).toBeInstanceOf(Function);
    });

    test('submitPaymentMethod thunk returns undefined', async () => {
        const payload = {
            type: 'paymentMethod',
            formValues: { paymentMethod }
        };
        const result = await submitPaymentMethod(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitPaymentMethod thunk dispatches actions on success', async () => {
        const payload = {
            type: 'paymentMethod',
            formValues: { paymentMethod }
        };
        const response = paymentMethod;

        request.mockResolvedValueOnce(response);
        await submitPaymentMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.paymentMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.paymentMethod.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitPaymentMethod thunk dispatches actions on failure', async () => {
        const payload = {
            type: 'paymentMethod',
            formValues: { paymentMethod }
        };
        const error = new Error('ERROR');

        request.mockRejectedValueOnce(error);
        await submitPaymentMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.paymentMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.paymentMethod.reject(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitPaymentMethod thunk throws if there is no guest cart', async () => {
        const payload = {
            type: 'paymentMethod',
            formValues: { paymentMethod }
        };

        getState.mockImplementationOnce(() => ({
            cart: {
                details: {
                    billing_address: address
                }
            },
            directory: { countries }
        }));

        await expect(
            submitPaymentMethod(payload)(...thunkArgs)
        ).rejects.toThrow('guestCartId');
    });
});

describe('submitShippingMethod', () => {
    const shippingMethod = {
        carrier_code: 'flatrate',
        method_code: 'flatrate'
    };

    beforeAll(() => {
        getState.mockImplementation(() => ({
            cart: {
                details: {
                    billing_address: address
                },
                guestCartId: 'GUEST_CART_ID'
            },
            checkout: { paymentMethod },
            directory: { countries }
        }));
    });

    afterAll(() => {
        getState.mockRestore();
    });

    test('submitShippingMethod() returns a thunk', () => {
        expect(submitShippingMethod()).toBeInstanceOf(Function);
    });

    test('submitShippingMethod thunk returns undefined', async () => {
        const payload = {
            type: 'shippingMethod',
            formValues: { shippingMethod }
        };
        const result = await submitShippingMethod(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitShippingMethod thunk dispatches actions on success', async () => {
        const payload = {
            type: 'shippingMethod',
            formValues: { shippingMethod }
        };
        const response = shippingMethod;

        request.mockResolvedValueOnce(response);
        await submitShippingMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.shippingMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.shippingMethod.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitShippingMethod thunk dispatches actions on failure', async () => {
        const payload = {
            type: 'shippingMethod',
            formValues: { shippingMethod }
        };
        const error = new Error('ERROR');

        request.mockRejectedValueOnce(error);
        await submitShippingMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.shippingMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.shippingMethod.reject(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitShippingMethod thunk throws if there is no guest cart', async () => {
        const payload = {
            type: 'shippingMethod',
            formValues: { shippingMethod }
        };

        getState.mockImplementationOnce(() => ({
            cart: {
                details: {
                    billing_address: address
                }
            },
            checkout: { paymentMethod },
            directory: { countries }
        }));

        await expect(
            submitShippingMethod(payload)(...thunkArgs)
        ).rejects.toThrow('guestCartId');
    });
});

describe('submitOrder', () => {
    beforeAll(() => {
        getState.mockImplementation(() => ({
            cart: {
                details: {
                    billing_address: address
                },
                guestCartId: 'GUEST_CART_ID'
            },
            checkout: { paymentMethod },
            directory: { countries }
        }));
    });

    afterAll(() => {
        getState.mockRestore();
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
                billing_address: address
            })
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.order.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);
    });

    test('submitOrder thunk dispatches actions on failure', async () => {
        const error = new Error('ERROR');

        request.mockRejectedValueOnce(error);
        await submitOrder()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.order.reject(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitOrder thunk throws if there is no guest cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {
                details: {
                    billing_address: address
                }
            },
            checkout: { paymentMethod },
            directory: { countries }
        }));

        await expect(submitOrder()(...thunkArgs)).rejects.toThrow(
            'guestCartId'
        );
    });
});

describe('formatAddress', () => {
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
});
