import React from 'react';
import { act } from 'react-test-renderer';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCategory } from '../useCategory';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({ pathname: '', search: '' }))
}));

jest.mock('../../../../hooks/useScrollTopOnChange');

jest.mock('../../../../context/app', () => {
    const state = {};
    const api = {
        actions: { setPageLoading: jest.fn() }
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

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

jest.mock('../../../../hooks/usePagination', () => ({
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

jest.mock('../../../../hooks/useSort', () => ({
    useSort: jest.fn().mockImplementation(() => mockUseSort())
}));

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQuery = jest.fn(() => ({
        called: false,
        data: null,
        loading: false
    }));
    const useLazyQuery = jest.fn();

    return { ...apolloClient, useLazyQuery, useQuery };
});

const mockProps = {
    id: 'Mg==',
    queries: {}
};

const mockPageSizeData = {
    called: true,
    data: {
        __type: {
            inputFields: []
        },
        storeConfig: {
            grid_per_page: 12
        }
    },
    error: null,
    loading: false
};

const mockFilterInputsData = {
    called: true,
    error: null,
    loading: false,
    data: {
        __type: {
            inputFields: [
                {
                    name: 'category_id',
                    type: {
                        name: 'FilterEqualTypeInput'
                    }
                },
                {
                    name: 'price',
                    type: {
                        name: 'FilterRangeTypeInput'
                    }
                }
            ]
        }
    }
};

const mockCategoryData = {
    called: true,
    error: null,
    loading: false,
    data: {
        categories: {
            items: [
                {
                    meta_description: 'Category meta-description'
                }
            ]
        },
        products: {
            page_info: {
                total_pages: 6
            }
        }
    }
};

const mockRunQuery = jest.fn();

const Component = props => {
    const talonProps = useCategory(props);
    return <i talonProps={talonProps} />;
};
describe('useCategory tests', () => {
    test('returns the correct shape', () => {
        useQuery.mockReturnValue(mockPageSizeData);
        useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();
    });

    test('runs the category query', () => {
        useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);
        useQuery
            .mockReturnValueOnce(mockPageSizeData)
            .mockReturnValueOnce(mockFilterInputsData);

        useLocation.mockReturnValue({
            pathname: '',
            search: 'page=1&price%5Bfilter%5D=0-100%2C0_100'
        });

        createTestInstance(<Component {...mockProps} />);

        expect(mockRunQuery).toHaveBeenCalledTimes(1);
        expect(mockRunQuery.mock.calls[0][0]).toMatchSnapshot();
    });

    test('resets the current page on error', () => {
        useLazyQuery.mockReturnValue([
            mockRunQuery,
            {
                loading: false,
                error: {
                    message: 'An error ocurred!'
                },
                data: null
            }
        ]);
        useQuery
            .mockReturnValueOnce(mockPageSizeData)
            .mockReturnValueOnce(mockFilterInputsData);

        createTestInstance(<Component {...mockProps} />);

        expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1, false);
    });

    test('handles no filter type data available', () => {
        useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);
        useQuery.mockReturnValueOnce(mockPageSizeData).mockReturnValueOnce({
            error: null,
            loading: true,
            data: null
        });
        createTestInstance(<Component {...mockProps} />);

        expect(mockRunQuery).toHaveBeenCalledTimes(0);
    });

    test('category query loading state', () => {
        useLazyQuery.mockReturnValue([
            mockRunQuery,
            {
                loading: true,
                error: null,
                data: null
            }
        ]);
        useQuery
            .mockReturnValueOnce(mockPageSizeData)
            .mockReturnValueOnce(mockFilterInputsData);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { loading, categoryData } = talonProps;

        expect(loading).toBeTruthy();
        expect(categoryData).toBeNull();
    });

    test('loading state when only categoryLoading is involved', () => {
        useLazyQuery.mockReturnValue([
            mockRunQuery,
            {
                called: true,
                loading: true,
                error: null,
                data: null
            }
        ]);
        useQuery.mockReturnValueOnce(mockPageSizeData).mockReturnValueOnce({
            called: false,
            loading: false,
            error: null,
            data: null
        });

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { loading } = talonProps;

        expect(loading).toBeTruthy();
    });

    test('sets current page to 1 if error, !loading, !data, and currentPage != 1', () => {
        useLazyQuery.mockReturnValue([
            mockRunQuery,
            {
                ...mockCategoryData,
                loading: false,
                data: null,
                error: true
            }
        ]);

        createTestInstance(<Component {...mockProps} />);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(1, false);
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
            useQuery.mockReturnValue(mockPageSizeData);
            useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);

            const tree = createTestInstance(<Component {...mockProps} />);

            mockUseSort.mockReturnValueOnce([sortParams, jest.fn()]);
            act(() => {
                tree.update(<Component {...mockProps} />);
            });

            expect(mockSetCurrentPage).toHaveBeenCalledTimes(expected);
        }
    );

    test('preserve history when search term changes', () => {
        useQuery.mockReturnValue(mockPageSizeData);
        useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);

        const tree = createTestInstance(<Component {...mockProps} />);

        mockUseSort.mockReturnValueOnce([
            {
                sortText: 'Best Match',
                sortAttribute: 'relevance',
                sortDirection: 'Changed'
            },
            jest.fn()
        ]);
        expect(mockSetCurrentPage).not.toHaveBeenCalledWith(1, true);
        act(() => {
            tree.update(<Component {...mockProps} />);
        });
        expect(mockSetCurrentPage).toHaveBeenCalledWith(1, true);
    });
});
