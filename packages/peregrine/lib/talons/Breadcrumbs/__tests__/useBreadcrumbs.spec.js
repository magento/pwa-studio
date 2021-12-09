import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useQuery } from '@apollo/client';

import { useBreadcrumbs } from '../useBreadcrumbs';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQueryMock = jest.fn().mockReturnValue({
        data: {
            categories: {
                items: [
                    {
                        uid: 'NA==',
                        name: 'Tiki',
                        url_path: 'tiki',
                        breadcrumbs: [
                            {
                                category_uid: 'Mw==',
                                category_name: 'Shop',
                                category_level: 1,
                                category_url_path: 'tiki/shop'
                            },
                            {
                                category_uid: 'MTQ==',
                                category_name: 'Foo',
                                category_level: 2,
                                category_url_path: 'tiki/shop/foo'
                            }
                        ]
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

jest.mock('../../../hooks/useInternalLink', () =>
    jest.fn(() => ({
        setShimmerType: jest.fn()
    }))
);

const storeConfigResponse = {
    data: {
        storeConfig: {
            store_code: 'default',
            category_url_suffix: '.html'
        }
    }
};

const props = {
    categoryId: 1
};

const log = jest.fn();

const Component = props => {
    const talonProps = useBreadcrumbs(props);
    log(talonProps);

    return <i />;
};

test('return correct shape while data is loading', () => {
    useQuery
        .mockReturnValueOnce({
            loading: true
        })
        .mockReturnValueOnce(storeConfigResponse);

    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];
    expect(talonProps).toEqual({
        currentCategory: '',
        currentCategoryPath: '#',
        isLoading: true,
        hasError: false,
        normalizedData: [],
        handleClick: expect.any(Function)
    });
});

test('returns sorted data', () => {
    useQuery
        .mockReturnValueOnce({
            data: {
                categories: {
                    items: [
                        {
                            uid: 'NA==',
                            name: 'Tiki',
                            url_path: 'tiki',
                            breadcrumbs: [
                                {
                                    category_id: 'Mw==',
                                    category_name: 'Shop',
                                    category_level: 1,
                                    category_url_path: 'tiki/shop'
                                },
                                {
                                    category_id: 'MTQ==',
                                    category_name: 'Foo',
                                    category_level: 2,
                                    category_url_path: 'tiki/shop/foo'
                                }
                            ]
                        }
                    ]
                }
            },
            error: false,
            loading: false
        })
        .mockReturnValueOnce(storeConfigResponse);

    createTestInstance(<Component {...props} />);
    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toEqual({
        currentCategory: 'Tiki',
        currentCategoryPath: 'tiki.html',
        isLoading: false,
        hasError: false,
        normalizedData: [
            {
                category_level: 1,
                path: '/tiki/shop.html',
                text: 'Shop'
            },
            {
                category_level: 2,
                path: '/tiki/shop/foo.html',
                text: 'Foo'
            }
        ],
        handleClick: expect.any(Function)
    });
});

test('returns the correct shape', () => {
    useQuery
        .mockReturnValueOnce({
            loading: true
        })
        .mockReturnValueOnce(storeConfigResponse);

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const expectedProperties = [
        'currentCategory',
        'currentCategoryPath',
        'isLoading',
        'hasError',
        'normalizedData',
        'handleClick'
    ];
    const actualProperties = Object.keys(talonProps);
    expect(actualProperties.sort()).toEqual(expectedProperties.sort());
});
