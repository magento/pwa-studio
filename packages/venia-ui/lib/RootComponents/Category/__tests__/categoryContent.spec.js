import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CategoryContent from '../categoryContent';

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);
    return { useAppContext };
});

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title'
}));

jest.mock('../../../components/Breadcrumbs', () => 'Breadcrumbs');
jest.mock('../../../components/Gallery', () => 'Gallery');
jest.mock('../../../components/Pagination', () => 'Pagination');
jest.mock('../NoProductsFound', () => 'NoProductsFound');

const classes = {
    root: 'a',
    title: 'b',
    gallery: 'c',
    pagination: 'd'
};

const sortProps = [
    { sortDirection: '', sortAttribute: '', sortText: '' },
    jest.fn()
];

test('renders the correct tree', () => {
    const data = {
        category: {
            name: 'Name',
            description: 'test'
        },
        products: {
            items: {
                id: 1
            },
            page_info: {
                total_pages: 1
            }
        }
    };

    const instance = createTestInstance(
        <CategoryContent
            pageControl={{}}
            data={data}
            pageSize={6}
            sortProps={sortProps}
            classes={classes}
        />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders empty page', () => {
    const data = {
        category: {
            name: 'Empty Name',
            description: 'test'
        },
        products: {
            items: null,
            page_info: {
                total_pages: 0
            }
        }
    };

    const instance = createTestInstance(
        <CategoryContent
            pageControl={{}}
            data={data}
            pageSize={6}
            sortProps={sortProps}
            classes={classes}
        />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
