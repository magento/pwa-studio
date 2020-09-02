import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { act } from 'react-test-renderer';
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
                        category_id: 10,
                        category_name: 'Shopee',
                        category_level: 2,
                        category_url_path: 'tiki/shopee'
                    },
                    {
                        category_id: 12,
                        category_name: 'Shopee',
                        category_level: 1,
                        category_url_path: 'tiki/shopee'
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

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
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
                        category_name: 'Shopee',
                        category_level: 2,
                        category_url_path: 'tiki/shopee'
                    }
                ]
            }
        },
        error: false,
        loading: false
    });
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    expect(talonProps).toMatchSnapshot();
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
