import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import Category from '../category';

jest.mock('@magento/peregrine/lib/talons/RootComponents/Category', () => ({
    useCategory: jest.fn()
}));

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title',
    Meta: () => 'Meta'
}));

jest.mock('../categoryContent', () => 'CategoryContent');

const talonProps = {
    error: null,
    metaDescription: 'Meta Description',
    loading: false,
    categoryData: {
        products: {
            page_info: {
                total_pages: 6
            }
        }
    },
    pageControl: {
        currentPage: 1,
        setPage: jest.fn(),
        totalPages: 6
    },
    sortProps: [
        {
            sortText: 'Best Match',
            sortAttribute: 'relevance',
            sortDirection: 'DESC'
        },
        jest.fn()
    ],
    pageSize: 12
};

const categoryProps = {
    id: 3
};

test('renders the correct tree', () => {
    useCategory.mockReturnValueOnce(talonProps);
    const tree = createTestInstance(<Category {...categoryProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe('it renders a loading indicator when appropriate', () => {
    test('renders no indicator when data is present', () => {
        useCategory.mockReturnValueOnce({
            ...talonProps,
            loading: true
        });
        const tree = createTestInstance(<Category {...categoryProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders an indicator when data is not present', () => {
        useCategory.mockReturnValueOnce({
            ...talonProps,
            loading: true,
            categoryData: undefined
        });
        const tree = createTestInstance(<Category {...categoryProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});

test('it shows error when appropriate', () => {
    useCategory.mockReturnValueOnce({
        ...talonProps,
        error: true,
        loading: false
    });
    const tree = createTestInstance(<Category {...categoryProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
