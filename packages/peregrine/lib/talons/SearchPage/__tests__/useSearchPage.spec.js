import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';
import createTestInstance from '../../../util/createTestInstance';
import { getFiltersFromSearch } from '../../FilterModal/helpers';
import { useSearchPage } from '../useSearchPage';
import { getSearchParam } from '../../../hooks/useSearchParam';
import { useEventingContext } from '../../../context/eventing';

const log = jest.fn();
const Component = props => {
    const talonProps = useSearchPage({ ...props });
    useEffect(() => {
        log(talonProps);
    }, [talonProps]);
    return <i talonProps={talonProps} />;
};
const mockUseSort = jest
    .fn()
    .mockReturnValue([
        {
            sortText: 'Best Match',
            sortAttribute: 'relevance',
            sortDirection: 'DESC'
        },
        jest.fn()
    ])
    .mockName('mockUseSort');
const mockSetCurrentPage = jest.fn().mockName('mockSetCurrentPage');

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({
        pathname: '/search.html?query=test&page=1',
        search: 'query=test&page=1'
    }))
}));

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock('../../FilterModal/helpers', () => {
    return {
        ...jest.requireActual('../../FilterModal/helpers'),
        getFiltersFromSearch: jest.fn(() => new Map())
    };
});
jest.mock('../../../hooks/useSearchParam', () => {
    return {
        ...jest.requireActual('../../../hooks/useSearchParam'),
        getSearchParam: jest.fn(() => '')
    };
});
jest.mock('@magento/peregrine/lib/hooks/useScrollTopOnChange');
jest.mock('../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn(),
        actions: { setPageLoading: jest.fn() }
    };
    const useAppContext = jest.fn(() => [state, api]);
    return { useAppContext };
});
jest.mock('../../../hooks/usePagination', () => ({
    usePagination: jest.fn(() => [
        {
            currentPage: 3,
            totalPages: 6
        },
        {
            setCurrentPage: jest
                .fn()
                .mockImplementation((page, bool = false) =>
                    mockSetCurrentPage(page, bool)
                ),
            setTotalPages: jest.fn()
        }
    ])
}));
jest.mock('../../../hooks/useSort', () => ({
    useSort: jest.fn().mockImplementation(() => mockUseSort())
}));
jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    const useQuery = jest.fn().mockReturnValue({
        data: {
            __type: {
                inputFields: [
                    {
                        name: 'category_id',
                        type: { name: 'FilterEqualTypeInput' }
                    }
                ]
            },
            storeConfig: {
                grid_per_page: 12
            }
        },
        error: null,
        loading: false
    });
    const runSearchQuery = jest.fn();
    const searchQueryResult = {
        data: {
            products: {
                page_info: {
                    total_pages: 6
                }
            }
        },
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runSearchQuery, searchQueryResult]);
    return { ...apolloClient, useLazyQuery, useQuery };
});
const initialProps = { queries: {} };

const mockAvailableSortMethods = {
    products: {
        sort_fields: {
            options: [
                {
                    label: 'Position',
                    value: 'position'
                }
            ]
        }
    }
};

const mockGetSearchAvailableSortMethods = jest.fn();

describe('searchCategory', () => {
    test('returns the correct shape', () => {
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        createTestInstance(<Component {...initialProps} />);
        const talonProps = log.mock.calls[0][0];
        expect(talonProps).toMatchSnapshot();
    });
    test('is null when no filters exist', () => {
        // Arrange.
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        getFiltersFromSearch.mockReturnValueOnce(new Map());
        // Act.
        createTestInstance(<Component {...initialProps} />);
        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toBeNull();
    });
    test('is null when category_id doesnt exist', () => {
        // Arrange.
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        const map = new Map().set('not_category_id', 'unit test');
        getFiltersFromSearch.mockReturnValueOnce(map);
        // Act.
        createTestInstance(<Component {...initialProps} />);
        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toBeNull();
    });
    test('is correct when a single category filter exists', () => {
        // Arrange.
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        const map = new Map().set('category_id', new Set(['Bottoms,11']));
        getFiltersFromSearch.mockReturnValueOnce(map);
        // Act.
        createTestInstance(<Component {...initialProps} />);
        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toEqual('Bottoms');
    });
    test('is correct when multiple category filters exist', () => {
        // Arrange.
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        const map = new Map().set(
            'category_id',
            new Set(['Bottoms,11', 'Skirts,12'])
        );
        getFiltersFromSearch.mockReturnValueOnce(map);
        // Act.
        createTestInstance(<Component {...initialProps} />);
        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toEqual('Bottoms, Skirts');
    });
    const testCases = [
        [
            'sortText does not reset',
            {
                sortText: 'Changed',
                sortAttribute: 'relevance',
                sortDirection: 'DESC'
            },
            0
        ],
        [
            'sortAttribute resets',
            {
                sortText: 'Best Match',
                sortAttribute: 'Changed',
                sortDirection: 'DESC'
            },
            1
        ],
        [
            'sortDirection resets',
            {
                sortText: 'Best Match',
                sortAttribute: 'relevance',
                sortDirection: 'Changed'
            },
            1
        ]
    ];
    test.each(testCases)(
        'Changing %s current page to 1.',
        (description, sortParams, expected) => {
            mockUseSort.mockReturnValueOnce([sortParams, jest.fn()]);
            useLazyQuery.mockReturnValueOnce([
                mockGetSearchAvailableSortMethods,
                { data: mockAvailableSortMethods }
            ]);
            const tree = createTestInstance(<Component {...initialProps} />);
            act(() => {
                useLazyQuery.mockReturnValueOnce([
                    mockGetSearchAvailableSortMethods,
                    { data: mockAvailableSortMethods }
                ]);
                tree.update(<Component {...initialProps} />);
            });
            expect(mockSetCurrentPage).toHaveBeenCalledTimes(expected);
        }
    );
    test('preserve history when search term changes on Search Page', () => {
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        mockUseSort.mockReturnValueOnce([
            {
                sortText: 'Best Match',
                sortAttribute: 'Changed',
                sortDirection: 'DESC'
            },
            jest.fn()
        ]);
        const tree = createTestInstance(<Component {...initialProps} />);
        expect(mockSetCurrentPage).not.toHaveBeenCalledWith(1, true);
        act(() => {
            useLazyQuery.mockReturnValueOnce([
                mockGetSearchAvailableSortMethods,
                { data: mockAvailableSortMethods }
            ]);
            tree.update(<Component {...initialProps} />);
        });
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1, true);
    });

    test('should dispatch event when search request takes effect', () => {
        // Mock filter,sort, and query
        const map = new Map().set('category_id', 'FilterEqualTypeInput');
        getFiltersFromSearch.mockReturnValue(map);
        getSearchParam.mockReturnValueOnce('Search Query Value');
        useLazyQuery.mockReturnValueOnce([
            mockGetSearchAvailableSortMethods,
            { data: mockAvailableSortMethods }
        ]);
        mockUseSort.mockReturnValueOnce([
            {
                sortText: 'Sort Text',
                sortAttribute: 'Sort Attribute',
                sortDirection: 'DESC'
            },
            jest.fn()
        ]);

        // Mock dispatcher
        const mockDispatch = jest.fn();

        useEventingContext.mockReturnValue([
            {},
            {
                dispatch: mockDispatch
            }
        ]);

        createTestInstance(<Component {...initialProps} />);

        expect(mockDispatch).toBeCalledTimes(1);

        expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
    });
});
