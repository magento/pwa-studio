import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCategory } from '@magento/peregrine/lib/talons/RootComponents/Category';
import Category from '../category';

jest.mock('@magento/peregrine/lib/talons/RootComponents/Category', () => ({
    useCategory: jest.fn()
}));

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    StoreTitle: () => 'Title',
    Meta: () => 'Meta'
}));

jest.mock('../categoryContent', () => 'CategoryContent');

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => ({ push: jest.fn() }))
    };
});

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
    uid: 'Mg=='
};

describe('Category Root Component', () => {
    test('renders the correct tree', () => {
        useCategory.mockReturnValueOnce(talonProps);
        const tree = createTestInstance(<Category {...categoryProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    describe('error view', () => {
        test('does not render when data is present', () => {
            useCategory.mockReturnValueOnce({
                ...talonProps,
                error: true
            });
            const tree = createTestInstance(<Category {...categoryProps} />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders when data is not present and not loading', () => {
            useCategory.mockReturnValueOnce({
                ...talonProps,
                error: true,
                loading: false,
                categoryData: undefined
            });
            const tree = createTestInstance(<Category {...categoryProps} />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });
});
