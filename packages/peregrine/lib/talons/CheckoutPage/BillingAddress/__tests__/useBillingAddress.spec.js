import React from 'react';
import {
    useQuery,
    useMutation,
    useLazyQuery,
    useApolloClient
} from '@apollo/client';

import createTestInstance from '../../../../util/createTestInstance';
import { useBillingAddress } from '../useBillingAddress';

/**
 * Mocks
 */
const getBillingAddressQuery = 'getBillingAddressQuery';
const getIsBillingAddressSameQuery = 'getIsBillingAddressSameQuery';
const getShippingAddressQuery = 'getShippingAddressQuery';
const setBillingAddressMutation = 'setBillingAddressMutation';

jest.mock('@apollo/client');

const billingAddress = {
    firstName: 'ba fn',
    lastName: 'ba ln',
    country: {
        code: 'US'
    },
    street: ['45678 blvd', 'suite 300'],
    city: 'Austin',
    region: { code: 'TX' },
    postcode: '78945',
    phoneNumber: '1234567891'
};
const shippingAddress = {
    firstName: 'sa fn',
    lastName: 'sa ln',
    country: {
        code: 'UK'
    },
    street: ['12345 ln', 'apt 123'],
    city: 'London',
    region: { code: 'TX' },
    postcode: '13245',
    phoneNumber: '7894561231'
};

const shippingAddressQueryResult = {
    data: {
        cart: {
            shippingAddresses: [
                {
                    __typename: 'Shipping Address',
                    ...shippingAddress
                }
            ]
        }
    }
};
const billingAddressQueryResult = {
    data: {
        cart: {
            billingAddress: {
                __typename: 'Billing Address',
                ...billingAddress
            }
        }
    }
};
const isBillingAddressSameQueryResult = {
    data: { cart: { isBillingAddressSame: false } }
};

const getBillingAddress = jest.fn().mockReturnValue([
    jest.fn().mockReturnValue(billingAddressQueryResult),
    {
        data: null,
        loading: false,
        called: false
    }
]);

const getShippingAddress = jest
    .fn()
    .mockReturnValue(shippingAddressQueryResult);
const getIsBillingAddressSame = jest
    .fn()
    .mockReturnValue(isBillingAddressSameQueryResult);

const setBillingAddress = jest.fn();

const setBillingAddressMutationResult = jest.fn().mockReturnValue([
    setBillingAddress,
    {
        error: null,
        loading: false,
        called: false
    }
]);

jest.mock('@magento/peregrine/lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

const writeQuery = jest.fn();

const operations = {
    getBillingAddressQuery,
    getIsBillingAddressSameQuery,
    getShippingAddressQuery,
    setBillingAddressMutation
};

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
            postcode: '',
            phoneNumber: ''
        },
        errors: {}
    }),
    useFormApi: jest.fn().mockReturnValue({
        validate: jest.fn()
    })
}));

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getBillingAddressQuery) {
            return getBillingAddress();
        } else if (query === getIsBillingAddressSameQuery) {
            return getIsBillingAddressSame();
        } else if (query === getShippingAddressQuery) {
            return getShippingAddress();
        } else {
            return { data: {} };
        }
    });

    useLazyQuery.mockReturnValue([
        () => {},
        {
            data: null,
            error: null,
            loading: true
        }
    ]);

    useLazyQuery.mockImplementation(query => {
        if (query === getBillingAddressQuery) {
            return getBillingAddress();
        }
    });

    useMutation.mockImplementation(mutation => {
        if (mutation === setBillingAddressMutation) {
            return setBillingAddressMutationResult();
        } else if (mutation === setCreditCardDetailsOnCartMutation) {
            return setCreditCardDetailsOnCartMutationResult();
        } else {
            return [jest.fn(), {}];
        }
    });

    useApolloClient.mockReturnValue({
        writeQuery
    });
});

const Component = props => {
    const talonProps = useBillingAddress(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

/**
 * Tests
 */
test('Should return correct shape', () => {
    const { talonProps } = getTalonProps({
        shouldSubmit: false,
        operations,
        onBillingAddressChangedError: () => {},
        onBillingAddressChangedSuccess: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});
