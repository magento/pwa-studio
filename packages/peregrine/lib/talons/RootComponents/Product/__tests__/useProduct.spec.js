import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { useProduct } from '../useProduct';

jest.mock('react-router-dom', () => {
    const useLocation = jest.fn().mockReturnValue({
        pathname: '/'
    });

    return { useLocation };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQueryMock = jest.fn().mockReturnValue({
        data: {
            products: {
                items: [
                    {
                        id: 1,
                        name: 'Karena Halter Dress',
                        url_key: 'karena-halter-dress',
                        price_range: {
                            maximum_price: {
                                final_price: {
                                    currency: 'USD',
                                    value: '100'
                                }
                            }
                        },
                        sku: 'TEST'
                    }
                ]
            }
        },
        error: null,
        loading: false
    });

    return {
        ...apolloClient,
        useQuery: useQueryMock
    };
});

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const log = jest.fn();
const Component = props => {
    const talonProps = useProduct({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    mapProduct: jest.fn(product => product)
};

const storeConfigResponse = {
    id: 1,
    product_url_suffix: null
};

test('it returns the proper shape', () => {
    // Arrange.
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: storeConfigResponse
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
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
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: storeConfigResponse
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
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
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: storeConfigResponse
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
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
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: storeConfigResponse
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                products: {
                    items: [
                        { name: 'INVALID', url_key: 'INVALID' },
                        { name: 'VALID', url_key: 'unit_test' }
                    ]
                }
            },
            error: null,
            loading: false
        });

    useLocation.mockImplementation(() => ({
        pathname: '/unit_test'
    }));

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toEqual({ name: 'VALID', url_key: 'unit_test' });
});

test('product is correct when product url suffix is configured', () => {
    // Arrange.
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: {
                    store_code: 'default',
                    product_url_suffix: '.html'
                }
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                products: {
                    items: [{ name: 'VALID', url_key: 'unit_test' }]
                }
            },
            error: null,
            loading: false
        });

    useLocation.mockImplementation(() => ({
        pathname: '/unit_test.html'
    }));

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toEqual({ name: 'VALID', url_key: 'unit_test' });
});

test('product is correct when product url suffix is configured with no period', () => {
    // Arrange.
    useQuery
        .mockReturnValueOnce({
            data: {
                storeConfig: {
                    store_code: 'default',
                    product_url_suffix: 'noperiod'
                }
            },
            error: null,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                products: {
                    items: [{ name: 'VALID', url_key: 'unit_test' }]
                }
            },
            error: null,
            loading: false
        });

    useLocation.mockImplementation(() => ({
        pathname: '/unit_testnoperiod'
    }));

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { product } = talonProps;
    expect(product).toEqual({ name: 'VALID', url_key: 'unit_test' });
});

test('should dispatch page view event', () => {
    const mockDispatchEvent = jest.fn();

    useEventingContext.mockReturnValue([
        {},
        {
            dispatch: mockDispatchEvent
        }
    ]);

    useLocation.mockImplementation(() => ({
        pathname: '/karena-halter-dress'
    }));

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.

    expect(mockDispatchEvent).toBeCalledTimes(1);

    expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
});
