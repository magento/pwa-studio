import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderRow } from '../useOrderRow';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useQuery: jest.fn()
    };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useOrderRow({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const defaultProps = {
    queries: { getProductThumbnailsQuery: 'getProductThumbnailsQuery' },
    items: [
        { product_sku: 'sku1', product_url_key: 'url_key_sku1' },
        { product_sku: 'sku2', product_url_key: 'url_key_sku2' }
    ]
};
const items = [
    {
        thumbnail: { url: 'sku1 thumbnail url' },
        url_key: 'url_key_sku1',
        sku: 'sku1'
    },
    {
        thumbnail: { url: 'sku2 thumbnail url' },
        url_key: 'url_key_sku2',
        sku: 'sku2'
    }
];
const dataResponse = {
    data: {
        products: {
            items
        },
        storeConfig: {
            store_code: 'default',
            configurable_thumbnail_source: 'parent'
        }
    },
    loading: false
};

test('returns correct shape', () => {
    useQuery.mockReturnValue(dataResponse);
    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('returns correct shape when variant', () => {
    const props = {
        ...defaultProps,
        items: [
            ...defaultProps.items,
            { product_sku: 'sku3_variant1', product_url_key: 'url_key_sku3' }
        ]
    };
    const data = {
        data: {
            products: {
                items: [
                    ...items,
                    {
                        thumbnail: { url: 'sku3 thumbnail url' },
                        url_key: 'url_key_sku3',
                        sku: 'sku3',
                        variants: [
                            {
                                product: {
                                    thumbnail: {
                                        url: 'sku3_variant1 thumbnail url'
                                    },
                                    sku: 'sku3_variant1'
                                }
                            },
                            {
                                product: {
                                    thumbnail: {
                                        url: 'sku3_variant2 thumbnail url'
                                    },
                                    sku: 'sku3_variant2'
                                }
                            }
                        ]
                    }
                ]
            },
            storeConfig: {
                store_code: 'default',
                configurable_thumbnail_source: 'itself'
            }
        },
        loading: false
    };
    useQuery.mockReturnValue(data);
    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('filters out items not in the request', () => {
    useQuery.mockReturnValue({
        data: {
            products: {
                items: [
                    ...items,
                    {
                        thumbnail: { url: 'bundle-sku thumbnail url' },
                        url_key: 'bundle-sku'
                    }
                ]
            },
            storeConfig: {
                store_code: 'default',
                configurable_thumbnail_source: 'parent'
            }
        },
        loading: false
    });

    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(Object.keys(talonProps.imagesData)).toHaveLength(2);
});

test('callback toggles open state', () => {
    useQuery.mockReturnValue(dataResponse);
    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleContentToggle();
    });

    const newTalonProps = log.mock.calls[1][0];

    expect(talonProps.isOpen).toBe(false);
    expect(newTalonProps.isOpen).toBe(true);
});
