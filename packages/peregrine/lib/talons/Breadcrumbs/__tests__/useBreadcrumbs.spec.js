import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useQuery } from '@apollo/client';

import { useBreadcrumbs } from '../useBreadcrumbs';

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockReturnValue({
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
    })
}));

const props = {
    categoryId: 1,
    query: {}
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
                path: '/tiki/shopee.html',
                text: 'Shopee'
            },
            {
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
