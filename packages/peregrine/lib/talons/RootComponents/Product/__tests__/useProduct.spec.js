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

test('product is null when items array doesnt contain requested urlKey', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: [{ name: 'INVALID', url_key: 'INVALID' }]
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

test('product is correct when included in items array', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            products: {
                items: [
                    { name: 'INVALID', url_key: 'INVALID' },
                    { name: 'VALID', url_key: props.urlKey }
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
    expect(product).toEqual({ name: 'VALID', url_key: props.urlKey });
});
