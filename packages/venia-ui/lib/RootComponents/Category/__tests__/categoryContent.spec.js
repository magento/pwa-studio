import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';
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
    StoreTitle: () => 'Title'
}));

jest.mock('@magento/peregrine/lib/talons/RootComponents/Category', () => ({
    useCategoryContent: jest.fn()
}));

jest.mock('../../../components/Breadcrumbs', () => 'Breadcrumbs');
jest.mock('../../../components/Gallery', () => 'Gallery');
jest.mock('../../../components/Pagination', () => 'Pagination');
jest.mock('../../../components/SortedByContainer', () => 'SortedByContainer');
jest.mock('../../../components/FilterModalOpenButton', () => 'FilterModalOpenButton');
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

const talonProps = {
    categoryName: 'Name',
    categoryDescription: 'test',
    filters: {},
    items: {
        id: 1
    },
    totalPagesFromData: 1
};

test('renders the correct tree', () => {
    const data = {
        products: {
            items: {
                id: 1
            },
            page_info: {
                total_pages: 1
            }
        }
    };
    useCategoryContent.mockReturnValueOnce(talonProps);
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
        products: {
            items: null,
            page_info: {
                total_pages: 0
            }
        }
    };
    useCategoryContent.mockReturnValueOnce({
        ...talonProps,
        categoryName: 'Empty Name',
        totalPagesFromData: 0
    });
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
