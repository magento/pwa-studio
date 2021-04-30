import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';
import SearchPage from '../searchPage';

jest.mock('@magento/peregrine/lib/talons/SearchPage/useSearchPage', () => ({
    useSearchPage: jest.fn()
}));

jest.mock('../../Gallery', () => 'Gallery');
jest.mock('../../FilterModal', () => 'FilterModal');
jest.mock('../../ProductSort', () => 'ProductSort');
jest.mock('../../../components/Pagination', () => 'Pagination');
jest.mock('@magento/venia-ui/lib/classify');
jest.mock('../../SortedByContainer', () => 'SortedByContainer');
jest.mock('../../FilterModalOpenButton', () => 'FilterModalOpenButton');

const talonProps = {
    data: {
        products: {
            items: [{}]
        }
    },
    error: null,
    filters: [],
    loading: false,
    openDrawer: jest.fn(),
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
    ]
};

describe('Search Page Component', () => {
    describe('loading indicator', () => {
        test('does not render when data is present', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                loading: true
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
        test('renders when data is not present', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                loading: true,
                data: undefined
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('error view', () => {
        test('does not render when data is present', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                error: true
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders when data is not present and not loading', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                error: true,
                loading: false,
                data: undefined
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('search results', () => {
        test('does not render if data returned has empty array', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                loading: true,
                data: {
                    products: {
                        items: []
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders if data has items', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                loading: true,
                data: {
                    products: {
                        items: [{}]
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('total count', () => {
        test('renders results from data', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [{}],
                        total_count: 1
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
        test('renders 0 items if data.products.total_count is falsy', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [],
                        total_count: 0
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('filter button/modal', () => {
        test('does not render if there are no filters', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                filters: []
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders when there are filters', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                filters: [{}]
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('sort button/container', () => {
        test('does not render if total count is 0', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [],
                        total_count: 0
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders when total count > 0', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [{}],
                        total_count: 1
                    }
                }
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe('search results heading', () => {
        test('renders a generic message if no search term', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [{}],
                        total_count: 1
                    }
                },
                searchTerm: false
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        test('renders a specific message if search term', () => {
            useSearchPage.mockReturnValueOnce({
                ...talonProps,
                data: {
                    products: {
                        items: [{}],
                        total_count: 1
                    }
                },
                searchTerm: 'Search Term',
                searchCategory: 'Search Category'
            });
            const tree = createTestInstance(<SearchPage />);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });
});
