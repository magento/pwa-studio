import React from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import createTestInstance from '../../../../util/createTestInstance';
import { useCreditCard } from '../useCreditCard';

/**
 * Mock Functions
 */

const getAllCountriesQuery = 'getAllCountriesQuery';
const getBillingAddressQuery = 'getBillingAddressQuery';
const getIsBillingAddressSameQuery = 'getIsBillingAddressSameQuery';
const getPaymentNonceQuery = 'getPaymentNonceQuery';

const getAllCountries = jest.fn().mockReturnValue({ data: [] });
const getBillingAddress = jest.fn().mockReturnValue({ data: {} });
const getIsBillingAddressSame = jest.fn().mockReturnValue({ data: [] });
const getPaymentNonce = jest.fn().mockReturnValue({ data: {} });
const writeQuery = jest.fn();

jest.mock('@apollo/react-hooks', () => {
    return { useQuery: jest.fn(), useApolloClient: jest.fn() };
});

jest.mock('../../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

beforeAll(() => {
    useQuery.mockImplementation(query => {
        if (query === getAllCountriesQuery) {
            return getAllCountries();
        } else if (query === getPaymentNonceQuery) {
            return getPaymentNonce();
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
        tree.update(<Component {...newProps} />);

        return talonProps;
    };

    return { talonProps, tree, update };
};

test('Snapshot test', () => {
    const { talonProps } = getTalonProps({
        onSuccess: () => {},
        operations: {
            queries: {
                getAllCountriesQuery,
                getBillingAddressQuery,
                getIsBillingAddressSameQuery,
                getPaymentNonceQuery
            }
        },
        isHidden: false,
        onReady: () => {},
        onError: () => {}
    });

    expect(talonProps).toMatchSnapshot();
});
