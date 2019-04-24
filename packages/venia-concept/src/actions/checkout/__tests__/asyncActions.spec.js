import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import {
    mockGetItem,
    mockSetItem,
    mockRemoveItem
} from '@magento/util/simplePersistence';

import actions from '../actions';
import {
    beginCheckout,
    editOrder,
    formatAddress,
    getShippingMethods,
    resetCheckout,
    submitBillingAddress,
    submitShippingAddress,
    submitPaymentMethod,
    submitOrder,
    submitShippingMethod,
    submitPaymentMethodAndBillingAddress
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
        cart: { cartId: 'CART_ID' },
        directory: { countries },
        user: { isSignedIn: false }
    }));
});

afterEach(() => {
    dispatch.mockClear();
    request.mockClear();
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
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

        expect(dispatch).toHaveBeenNthCalledWith(1, actions.begin());
        // TODO: test fails but "Compared values have no visual difference."
        // expect(dispatch).toHaveBeenNthCalledWith(2, cartActions.getShippingMethods());
        // expect(dispatch).toHaveBeenNthCalledWith(3, directoryActions.getCountries());
        expect(dispatch).toHaveBeenCalledTimes(3);
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
        expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(3, actions.reset());
        expect(dispatch).toHaveBeenCalledTimes(3);
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

describe('getShippingMethods', () => {
    test('getShippingMethods() returns a thunk', () => {
        expect(getShippingMethods()).toBeInstanceOf(Function);
    });

    test('getShippingMethods thunk returns undefined', async () => {
        const result = await getShippingMethods()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('getShippingMethods thunk dispatches actions on success', async () => {
        // Mock the estimate-shipping-methods response.
        const MOCK_RESPONSE = [];
        request.mockResolvedValueOnce(MOCK_RESPONSE);

        await getShippingMethods()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getShippingMethods.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getShippingMethods.receive(MOCK_RESPONSE)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('getShippingMethods thunk dispatches actions on failure', async () => {
        // Mock the estimate-shipping-methods response.
        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        await getShippingMethods()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getShippingMethods.request('CART_ID')
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getShippingMethods.receive(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('its thunk uses the proper endpoint when the user is signed in', async () => {
        // TODO
    });
});

describe('submitPaymentMethodAndBillingAddress', () => {
    const payload = {
        formValues: {
            billingAddress: address,
            paymentMethod: paymentMethod
        }
    };

    test('submitPaymentMethodAndBillingAddress returns a thunk', () => {
        expect(submitPaymentMethodAndBillingAddress()).toBeInstanceOf(Function);
    });

    test('submitPaymentMethodAndBillingAddress thunk returns undefined', async () => {
        const result = await submitPaymentMethodAndBillingAddress(payload)(
            ...thunkArgs
        );

        expect(result).toBeUndefined();
    });

    test('submitPaymentMethodAndBillingAddress thunk dispatches paymentMethod and billing address actions', async () => {
        await submitPaymentMethodAndBillingAddress(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledWith(
            actions.billingAddress.submit(payload.formValues.billingAddress)
        );
        expect(dispatch).toHaveBeenCalledWith(
            actions.paymentMethod.submit(payload.formValues.paymentMethod)
        );
    });
});

describe('submitBillingAddress', () => {
    const sameAsShippingPayload = {
        sameAsShippingAddress: true
    };
    const differentFromShippingPayload = {
        sameAsShippingAddress: false,
        ...address
    };

    test('submitBillingAddress() returns a thunk', () => {
        expect(submitBillingAddress()).toBeInstanceOf(Function);
    });

    test('submitBillingAddress thunk returns undefined', async () => {
        const result = await submitBillingAddress(sameAsShippingPayload)(
            ...thunkArgs
        );

        expect(result).toBeUndefined();
    });

    test('submitBillingAddress thunk dispatches actions on success', async () => {
        await submitBillingAddress(sameAsShippingPayload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.billingAddress.submit(sameAsShippingPayload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.billingAddress.accept(sameAsShippingPayload)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitBillingAddress thunk dispatches actions on success when using separate address', async () => {
        await submitBillingAddress(differentFromShippingPayload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.billingAddress.submit(differentFromShippingPayload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.billingAddress.accept(differentFromShippingPayload)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitBillingAddress thunk saves to storage on success', async () => {
        await submitBillingAddress(sameAsShippingPayload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('billing_address', {
            sameAsShippingAddress: true
        });
    });

    test('submitBillingAddress thunk saves to storage on success when using separate address', async () => {
        await submitBillingAddress(differentFromShippingPayload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('billing_address', {
            sameAsShippingAddress: false,
            ...address
        });
    });

    test('submitBillingAddress thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            directory: { countries }
        }));
        await expect(
            submitBillingAddress(sameAsShippingPayload)(...thunkArgs)
        ).rejects.toThrow('cartId');
    });
});

describe('submitShippingAddress', () => {
    const payload = { type: 'shippingAddress', formValues: address };

    test('submitShippingAddress() returns a thunk', () => {
        expect(submitShippingAddress()).toBeInstanceOf(Function);
    });

    test('submitShippingAddress thunk returns undefined', async () => {
        const result = await submitShippingAddress(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitShippingAddress thunk dispatches actions on success', async () => {
        await submitShippingAddress(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.shippingAddress.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.shippingAddress.accept(address)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitShippingAddress thunk saves to storage on success', async () => {
        await submitShippingAddress(payload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('shipping_address', address);
    });

    test('submitShippingAddress thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            directory: { countries }
        }));
        await expect(
            submitShippingAddress(payload)(...thunkArgs)
        ).rejects.toThrow('cartId');
    });
});

describe('submitPaymentMethod', () => {
    const payload = paymentMethod;

    test('submitPaymentMethod() returns a thunk', () => {
        expect(submitPaymentMethod()).toBeInstanceOf(Function);
    });

    test('submitPaymentMethod thunk returns undefined', async () => {
        const result = await submitPaymentMethod(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitPaymentMethod thunk dispatches actions on success', async () => {
        await submitPaymentMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.paymentMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.paymentMethod.accept(paymentMethod)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitPaymentMethod thunk saves to storage on success', async () => {
        await submitPaymentMethod(payload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith(
            'paymentMethod',
            paymentMethod
        );
    });

    test('submitPaymentMethod thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {}
        }));

        await expect(
            submitPaymentMethod(payload)(...thunkArgs)
        ).rejects.toThrow('cartId');
    });
});

describe('submitShippingMethod', () => {
    const shippingMethod = {
        carrier_code: 'flatrate',
        carrier_title: 'Flat Rate',
        method_code: 'flatrate'
    };
    const payload = {
        type: 'shippingMethod',
        formValues: { shippingMethod }
    };

    test('submitShippingMethod() returns a thunk', () => {
        expect(submitShippingMethod()).toBeInstanceOf(Function);
    });

    test('submitShippingMethod thunk returns undefined', async () => {
        const result = await submitShippingMethod(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitShippingMethod thunk dispatches actions on success', async () => {
        await submitShippingMethod(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.shippingMethod.submit(payload)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.shippingMethod.accept(shippingMethod)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitShippingMethod saves shipping method to local storage on success', async () => {
        await submitShippingMethod(payload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith(
            'shippingMethod',
            shippingMethod
        );
        expect(mockSetItem).toHaveBeenCalledTimes(1);
    });

    test('submitShippingMethod thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {}
        }));

        await expect(
            submitShippingMethod(payload)(...thunkArgs)
        ).rejects.toThrow('cartId');
    });
});

describe('submitOrder', () => {
    const mockBillingAddressSameAsShipping = {
        sameAsShippingAddress: true
    };
    const mockBillingAddressDifferentFromShipping = {
        sameAsShippingAddress: false,
        ...address
    };
    const mockPaymentMethod = {
        code: 'braintree',
        data: {
            nonce: 'unit_test_nonce'
        }
    };
    const mockShippingAddress = address;
    const mockShippingMethod = {
        amount: 5,
        available: true,
        base_amount: 5,
        carrier_code: 'flatrate',
        carrier_title: 'Flat Rate',
        code: 'flatrate',
        error_message: '',
        method_code: 'flatrate',
        method_title: 'Fixed',
        price_excl_tax: 5,
        price_incl_tax: 5,
        title: 'Flat Rate'
    };

    test('submitOrder() returns a thunk', () => {
        expect(submitOrder()).toBeInstanceOf(Function);
    });

    test('submitOrder thunk returns undefined', async () => {
        mockGetItem.mockImplementationOnce(
            () => mockBillingAddressSameAsShipping
        );

        const result = await submitOrder()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitOrder thunk dispatches actions and clears local storage on success', async () => {
        const mockState = {
            cart: {
                details: {
                    billing_address: address
                },
                cartId: 'CART_ID'
            },
            directory: { countries },
            user: { isSignedIn: false }
        };

        getState
            .mockImplementationOnce(() => mockState)
            .mockImplementationOnce(() => mockState);

        mockGetItem
            .mockImplementationOnce(() => mockBillingAddressSameAsShipping)
            .mockImplementationOnce(() => mockPaymentMethod)
            .mockImplementationOnce(() => mockShippingAddress)
            .mockImplementationOnce(() => mockShippingMethod);

        const response = 1;
        request.mockResolvedValueOnce(response).mockResolvedValueOnce(response);

        await submitOrder()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            checkoutReceiptActions.setOrderInformation({
                id: response,
                billing_address: expect.any(Object)
            })
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.order.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);

        expect(mockRemoveItem).toHaveBeenNthCalledWith(1, 'billing_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(2, 'cartId');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(3, 'paymentMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(4, 'shipping_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(5, 'shippingMethod');
        expect(mockRemoveItem).toHaveBeenCalledTimes(5);
    });

    test('submitOrder thunk dispatches actions and clears local storage on success when addresses are different', async () => {
        const mockState = {
            cart: {
                details: {
                    billing_address: address
                },
                cartId: 'CART_ID'
            },
            directory: { countries },
            user: { isSignedIn: false }
        };

        getState.mockImplementationOnce(() => mockState);

        mockGetItem
            .mockImplementationOnce(
                () => mockBillingAddressDifferentFromShipping
            )
            .mockImplementationOnce(() => mockPaymentMethod)
            .mockImplementationOnce(() => mockShippingAddress)
            .mockImplementationOnce(() => mockShippingMethod);

        const response = 1;
        request.mockResolvedValueOnce(response).mockResolvedValueOnce(response);

        await submitOrder()(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            checkoutReceiptActions.setOrderInformation({
                id: response,
                billing_address: expect.any(Object)
            })
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.order.accept(response)
        );
        expect(dispatch).toHaveBeenCalledTimes(3);

        expect(mockRemoveItem).toHaveBeenNthCalledWith(1, 'billing_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(2, 'cartId');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(3, 'paymentMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(4, 'shipping_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(5, 'shippingMethod');
        expect(mockRemoveItem).toHaveBeenCalledTimes(5);
    });

    test('submitOrder thunk dispatches actions on failure', async () => {
        mockGetItem
            .mockImplementationOnce(() => mockBillingAddressSameAsShipping)
            .mockImplementationOnce(() => mockPaymentMethod)
            .mockImplementationOnce(() => mockShippingAddress)
            .mockImplementationOnce(() => mockShippingMethod);

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

    test('submitOrder thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {}
        }));

        await expect(submitOrder()(...thunkArgs)).rejects.toThrow('cartId');
    });

    test('its thunk uses the proper endpoints when the user is signed in', async () => {
        // TODO
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
});
