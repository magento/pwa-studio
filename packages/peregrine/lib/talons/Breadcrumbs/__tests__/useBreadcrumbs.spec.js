import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useQuery } from '@apollo/client';

import { useBreadcrumbs } from '../useBreadcrumbs';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQueryMock = jest.fn().mockReturnValue({
        data: {
            category: {
                id: null,
                name: 'Tiki',
                url_path: 'tiki',
                url_suffix: '.html',
                breadcrumbs: [
                    {
                        category_id: 12,
                        category_name: 'Shopee',
                        category_level: 1,
                        category_url_path: 'tiki/shopee'
                    },
                    {
                        category_id: 10,
                        category_name: 'Foo',
                        category_level: 2,
                        category_url_path: 'tiki/shopee/foo'
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
    useQuery.mockReturnValueOnce({
        loading: true
    });

    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];
    expect(talonProps).toEqual({
        currentCategory: '',
        currentCategoryPath: '#',
        isLoading: true,
        hasError: false,
        normalizedData: []
    });
});

test('returns sorted data', () => {
    useQuery.mockReturnValueOnce({
        data: {
            category: {
                id: null,
                name: 'Tiki',
                url_path: 'tiki',
                url_suffix: '.html',
                breadcrumbs: [
                    {
                        category_id: 12,
                        category_name: 'Shopee',
                        category_level: 1,
                        category_url_path: 'tiki/shopee'
                    },
                    {
                        category_id: 10,
                        category_name: 'Foo',
                        category_level: 2,
                        category_url_path: 'tiki/shopee/foo'
                    }
                ]
            }
        },
        error: false,
        loading: false
    });

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
                path: '/tiki/shopee.html',
                text: 'Shopee'
            },
            {
                category_level: 2,
                path: '/tiki/shopee/foo.html',
                text: 'Foo'
            }
        ]
    });
});

test('returns the correct shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const expectedProperties = [
        'currentCategory',
        'currentCategoryPath',
        'isLoading',
        'hasError',
        'normalizedData'
    ];
    const actualProperties = Object.keys(talonProps);
    expect(actualProperties.sort()).toEqual(expectedProperties.sort());
});
