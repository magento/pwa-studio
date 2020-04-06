import React from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { useFormApi } from 'informed';

import createTestInstance from '../../../../util/createTestInstance';
import { useCreditCard } from '../useCreditCard';

/**
 * Mock Functions
 */

const getAllCountriesQuery = 'getAllCountriesQuery';
const getBillingAddressQuery = 'getBillingAddressQuery';
const getIsBillingAddressSameQuery = 'getIsBillingAddressSameQuery';
const getPaymentNonceQuery = 'getPaymentNonceQuery';

const getAllCountries = jest.fn().mockReturnValue({ data: { countries: {} } });
const getBillingAddress = jest.fn().mockReturnValue({
    data: {
        cart: {
            billingAddress: {
                firstName: '',
                lastName: '',
                country: '',
                street1: '',
                street2: '',
                city: '',
                state: '',
                postalCode: '',
                phoneNumber: ''
            }
        }
    }
});
const getIsBillingAddressSame = jest
    .fn()
    .mockReturnValue({ data: { cart: { isBillingAddressSame: false } } });
const writeQuery = jest.fn();

const operations = {
    queries: {
        getAllCountriesQuery,
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getPaymentNonceQuery
    }
};

jest.mock('@apollo/react-hooks', () => {
    return { useQuery: jest.fn(), useApolloClient: jest.fn() };
});

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

jest.mock('informed', () => ({
    useFormState: jest.fn().mockReturnValue({
        values: {
            isBillingAddressSame: false,
            firstName: '',
            lastName: '',
            country: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            postalCode: '',
            phoneNumber: ''
        }
    }),
    useFormApi: jest.fn().mockReturnValue({
        setValue: () => {},
        setValues: () => {}
    })
}));

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getAllCountriesQuery) {
            return getAllCountries();
        } else if (query === getBillingAddressQuery) {
            return getBillingAddress();
        } else if (query === getIsBillingAddressSameQuery) {
            return getIsBillingAddressSame();
        } else {
            return { data: {} };
        }
    });

    useApolloClient.mockReturnValue({
        client: {
            writeQuery
        }
    });
});

const Component = props => {
    const talonProps = useCreditCard(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return talonProps;
    };

    return { talonProps, tree, update };
};

/**
 * Tests
 */

test('Snapshot test', () => {
    const { talonProps } = getTalonProps({
        operations,
        isHidden: false,
        onSuccess: () => {},
        onReady: () => {},
        onError: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});

test('UI fields should be restored if payment is not hidden and is ready, only once', () => {
    const billingAddress = { firstName: '', lastName: '' };
    const billingAddressData = {
        data: {
            cart: {
                billingAddress: {
                    __typename: '',
                    ...billingAddress
                }
            }
        }
    };
    const isBillingAddressSameData = {
        data: { cart: { isBillingAddressSame: false } }
    };
    const setValue = jest.fn();
    const setValues = jest.fn();
    useFormApi
        .mockReturnValueOnce({
            setValue,
            setValues
        })
        .mockReturnValueOnce({
            setValue,
            setValues
        });
    getIsBillingAddressSame
        .mockReturnValueOnce(isBillingAddressSameData)
        .mockReturnValueOnce(isBillingAddressSameData);
    getBillingAddress
        .mockReturnValueOnce(billingAddressData)
        .mockReturnValueOnce(billingAddressData);

    const { talonProps, update } = getTalonProps({
        operations,
        isHidden: false,
        onSuccess: () => {},
        onReady: () => {},
        onError: () => {}
    });

    talonProps.onPaymentReady();

    update();

    expect(setValue).toHaveBeenCalledWith('isBillingAddressSame', false);
    expect(setValues).toHaveBeenCalledWith(billingAddress);
});
