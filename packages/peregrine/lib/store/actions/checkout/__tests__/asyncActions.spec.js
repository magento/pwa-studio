import { Magento2 } from '../../../../RestApi';
import {
    mockGetItem,
    mockRemoveItem,
    mockSetItem
} from '../../../../util/simplePersistence';
import actions from '../actions';
import {
    beginCheckout,
    formatAddress,
    resetCheckout,
    submitBillingAddress,
    submitShippingAddress,
    submitPaymentMethod,
    submitOrder,
    submitShippingMethod,
    submitPaymentMethodAndBillingAddress
} from '../asyncActions';

jest.mock('../../../../RestApi');
jest.mock('../../../../util/simplePersistence');

const { request } = Magento2;
const dispatch = jest.fn();
const getState = jest.fn();
const thunkArgs = [dispatch, getState];

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

const fetchCartId = jest.fn().mockResolvedValue();

beforeAll(() => {
    getState.mockImplementation(() => ({
        cart: { cartId: 'CART_ID' },
        checkout: { countries },
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
        const result = await beginCheckout({
            fetchCartId
        })(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('beginCheckout thunk dispatches actions', async () => {
        await beginCheckout({
            fetchCartId
        })(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.reset());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.begin(expect.any(Object))
        );
    });
});

describe('resetCheckout', () => {
    test('resetCheckout() returns a thunk', () => {
        expect(
            resetCheckout({
                fetchCartId
            })
        ).toBeInstanceOf(Function);
    });

    test('resetCheckout thunk returns undefined', async () => {
        const result = await resetCheckout({
            fetchCartId
        })(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('resetCheckout thunk dispatches actions', async () => {
        await resetCheckout({
            fetchCartId
        })(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.reset());
        expect(dispatch).toHaveBeenCalledTimes(2);
    });
});

describe('submitPaymentMethodAndBillingAddress', () => {
    const payload = {
        countries,
        formValues: {
            billingAddress: address,
            paymentMethod: paymentMethod
        }
    };

    test('submitPaymentMethodAndBillingAddress returns a thunk', () => {
        expect(submitPaymentMethodAndBillingAddress()).toBeInstanceOf(Function);
    });

    test('submitPaymentMethodAndBillingAddress thunk dispatches paymentMethod and billing address actions', async () => {
        await submitPaymentMethodAndBillingAddress(payload)(...thunkArgs);

        // submitBillingAddress
        expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
        // submitPaymentMethod
        expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });
});

describe('submitBillingAddress', () => {
    const billingAddressSameAsShipping = {
        sameAsShippingAddress: true
    };
    const billingAddressDifferentFromShipping = {
        sameAsShippingAddress: false,
        ...address
    };
    const sameAddressesPayload = {
        billingAddress: billingAddressSameAsShipping,
        countries
    };
    const differentAddressesPayload = {
        billingAddress: billingAddressDifferentFromShipping,
        countries
    };

    test('submitBillingAddress() returns a thunk', () => {
        expect(submitBillingAddress()).toBeInstanceOf(Function);
    });

    test('submitBillingAddress thunk returns undefined', async () => {
        const result = await submitBillingAddress(sameAddressesPayload)(
            ...thunkArgs
        );

        expect(result).toBeUndefined();
    });

    test('submitBillingAddress thunk dispatches actions on success', async () => {
        await submitBillingAddress(sameAddressesPayload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.billingAddress.submit()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.billingAddress.accept(billingAddressSameAsShipping)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitBillingAddress thunk dispatches actions on success when using separate address', async () => {
        await submitBillingAddress(differentAddressesPayload)(...thunkArgs);

        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.billingAddress.submit()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.billingAddress.accept(billingAddressDifferentFromShipping)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitBillingAddress thunk saves to storage on success', async () => {
        await submitBillingAddress(sameAddressesPayload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('billing_address', {
            sameAsShippingAddress: true
        });
    });

    test('submitBillingAddress thunk saves to storage on success when using separate address', async () => {
        await submitBillingAddress(differentAddressesPayload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('billing_address', {
            sameAsShippingAddress: false,
            ...address
        });
    });

    test('submitBillingAddress thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));
        await expect(
            submitBillingAddress(sameAddressesPayload)(...thunkArgs)
        ).rejects.toThrow('cartId');
    });
});

describe('submitShippingAddress', () => {
    const addressData = ['SomeAddressData'];
    const payload = {
        countries,
        formValues: address,
        setGuestEmail: jest.fn().mockResolvedValue(),
        setShippingAddressOnCart: jest.fn().mockResolvedValue({
            data: {
                setShippingAddressesOnCart: {
                    cart: {
                        shipping_addresses: [
                            {
                                available_shipping_methods: addressData
                            }
                        ]
                    }
                }
            }
        }),
        type: 'shippingAddress'
    };

    test('submitShippingAddress() returns a thunk', () => {
        expect(submitShippingAddress()).toBeInstanceOf(Function);
    });

    test('submitShippingAddress thunk returns undefined', async () => {
        const result = await submitShippingAddress(payload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('submitShippingAddress thunk dispatches actions on success', async () => {
        await submitShippingAddress(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.shippingAddress.submit()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getShippingMethods.receive(addressData)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.shippingAddress.accept(address)
        );
    });

    test('submitShippingAddress thunk saves to storage on success', async () => {
        await submitShippingAddress(payload)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalledWith('shipping_address', address);
    });

    test('submitShippingAddress thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            checkout: { countries },
            user: { isSignedIn: false }
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
            actions.paymentMethod.submit()
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
            cart: {},
            user: { isSignedIn: false }
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
            actions.shippingMethod.submit()
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
            cart: {},
            user: { isSignedIn: false }
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
        expect(
            submitOrder({
                fetchCartId
            })
        ).toBeInstanceOf(Function);
    });

    test('submitOrder thunk returns undefined', async () => {
        mockGetItem
            .mockImplementationOnce(() => mockBillingAddressSameAsShipping)
            .mockImplementationOnce(() => mockPaymentMethod)
            .mockImplementationOnce(() => mockShippingAddress)
            .mockImplementationOnce(() => mockShippingMethod);

        const result = await submitOrder({
            fetchCartId
        })(...thunkArgs);

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
            checkout: { countries },
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

        await submitOrder({
            fetchCartId
        })(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.receipt.setOrder({
                id: response,
                shipping_address: expect.any(Object)
            })
        );
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(5, actions.order.accept());

        expect(mockRemoveItem).toHaveBeenCalledTimes(5);
        expect(mockRemoveItem).toHaveBeenNthCalledWith(1, 'billing_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(2, 'paymentMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(3, 'shipping_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(4, 'shippingMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(
            5,
            'availableShippingMethods'
        );
    });

    test('submitOrder thunk dispatches actions and clears local storage on success when addresses are different', async () => {
        const mockState = {
            cart: {
                details: {
                    billing_address: address
                },
                cartId: 'CART_ID'
            },
            checkout: { countries },
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

        await submitOrder({
            fetchCartId
        })(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.receipt.setOrder({
                id: response,
                shipping_address: expect.any(Object)
            })
        );
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        expect(dispatch).toHaveBeenNthCalledWith(5, actions.order.accept());

        expect(mockRemoveItem).toHaveBeenCalledTimes(5);
        expect(mockRemoveItem).toHaveBeenNthCalledWith(1, 'billing_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(2, 'paymentMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(3, 'shipping_address');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(4, 'shippingMethod');
        expect(mockRemoveItem).toHaveBeenNthCalledWith(
            5,
            'availableShippingMethods'
        );
    });

    test('submitOrder thunk dispatches actions on failure', async () => {
        mockGetItem
            .mockImplementationOnce(() => mockBillingAddressSameAsShipping)
            .mockImplementationOnce(() => mockPaymentMethod)
            .mockImplementationOnce(() => mockShippingAddress)
            .mockImplementationOnce(() => mockShippingMethod);

        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        try {
            await submitOrder({
                fetchCartId
            })(...thunkArgs);
        } catch (err) {
            // intentional throw
        }

        expect(dispatch).toHaveBeenNthCalledWith(1, actions.order.submit());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.order.reject(error)
        );
        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('submitOrder thunk throws if there is no cart', async () => {
        getState.mockImplementationOnce(() => ({
            cart: {},
            user: { isSignedIn: false }
        }));

        await expect(
            submitOrder({
                fetchCartId
            })(...thunkArgs)
        ).rejects.toThrow('cartId');
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
