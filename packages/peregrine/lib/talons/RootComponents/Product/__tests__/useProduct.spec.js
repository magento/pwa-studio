import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import { useProduct } from '../useProduct';

jest.mock('@apollo/client', () => {
    const queryResult = {
        loading: false,
        error: null,
        data: null
    };
    const useQuery = jest.fn(() => {
        queryResult;
    });

    return { useQuery };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useProduct({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    mapProduct: jest.fn(product => product),
    queries: {
        getProductQuery: 'getProductQuery'
    },
    urlKey: 'unit_test'
};

test('it returns the proper shape', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: []
            }
        },
        error: null,
        loading: false
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const actualKeys = Object.keys(talonProps);
    const expectedKeys = ['error', 'loading', 'product'];
    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('product is null when data is falsy', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: null,
        error: null,
        loading: false
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toBeNull();
});

test('product is null when items array is empty', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: []
            }
        },
        error: null,
        loading: false
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toBeNull();
});

test('product is null when items array contains unsupported product types only', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: [{ name: 'INVALID', __typename: 'GroupedProduct' }]
            }
        },
        error: null,
        loading: false
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toBeNull();
});

test('product is the first supported product type', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: [
                    { name: 'INVALID', __typename: 'GroupedProduct' },
                    { name: 'VALID', __typename: 'SimpleProduct' },
                    { name: 'VALID', __typename: 'ConfigurableProduct' }
                ]
            }
        },
        error: null,
        loading: false
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toEqual({ name: 'VALID', __typename: 'SimpleProduct' });
});
