import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { useProductListing } from '../useProductListing';

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };

    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useLazyQuery: jest.fn().mockReturnValue([
            jest.fn(),
            {
                called: false,
                error: null,
                loading: false,
                data: null
            }
        ]),
        useQuery: jest.fn().mockReturnValue({
            data: {
                storeConfig: {
                    wishlistEnabled: true
                }
            }
        })
    };
});

const Component = props => {
    const talonProps = useProductListing(props);

    return <i {...talonProps} />;
};

const props = {
    queries: {
        getProductListing: 'getProductListingQuery'
    }
};

const mockFetchProductListing = jest.fn();

const mockData = {
    cart: {
        items: [
            {
                id: '14',
                product: {
                    name: 'Strive Shoulder Pack',
                    sku: '24-MB04'
                },
                quantity: 2
            },
            {
                id: '17',
                product: {
                    name: 'Savvy Shoulder Tote',
                    sku: '24-WB05'
                },
                quantity: 1
            }
        ]
    }
};

it('returns the proper shape', () => {
    useLazyQuery.mockReturnValue([
        mockFetchProductListing,
        {
            called: true,
            data: mockData,
            error: null,
            loading: false
        }
    ]);

    const rendered = createTestInstance(<Component {...props} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

it('returns an empty list of items before the query runs', () => {
    useLazyQuery.mockReturnValue([
        mockFetchProductListing,
        {
            called: false,
            data: null,
            error: null,
            loading: false
        }
    ]);

    const rendered = createTestInstance(<Component {...props} />);

    const talonProps = rendered.root.findByType('i').props;

    const { items } = talonProps;

    expect(items).toHaveLength(0);
});

it('does not fetch product listing when there is no cart id', () => {
    useCartContext.mockReturnValue([
        {
            cartId: null
        },
        {}
    ]);

    useLazyQuery.mockReturnValue([
        mockFetchProductListing,
        {
            called: true,
            data: mockData,
            error: null,
            loading: false
        }
    ]);

    const rendered = createTestInstance(<Component {...props} />);

    rendered.root.findByType('i').props;

    expect(mockFetchProductListing).not.toHaveBeenCalled();
});

it('returns error message', () => {
    const mockError = { message: 'Some error message' };
    useLazyQuery.mockReturnValue([
        mockFetchProductListing,
        {
            called: true,
            data: mockData,
            error: mockError,
            loading: false
        }
    ]);

    const rendered = createTestInstance(<Component {...props} />);

    const talonProps = rendered.root.findByType('i').props;
    const { error } = talonProps;

    expect(error).toEqual(mockError);
});
