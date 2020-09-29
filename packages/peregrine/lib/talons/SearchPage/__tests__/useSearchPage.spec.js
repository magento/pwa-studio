import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { useSearchPage } from '../useSearchPage';

import createTestInstance from '../../../util/createTestInstance';
import { getFiltersFromSearch } from '../../FilterModal/helpers';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({ pathname: '', search: '' }))
}));

jest.mock('../../FilterModal/helpers', () => {
    return {
        ...jest.requireActual('../../FilterModal/helpers'),
        getFiltersFromSearch: jest.fn(() => new Map())
    };
});

jest.mock('../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
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

jest.mock('@magento/peregrine', () => {
    const usePagination = jest.fn(() => [
        {
            currentPage: 3,
            totalPages: 6
        },
        {
            setCurrentPage: jest
                .fn()
                .mockImplementation(() => mockSetCurrentPage()),
            setTotalPages: jest.fn()
        }
    ]);
    const useSort = jest.fn().mockImplementation(() => mockUseSort());

    return {
        useSort,
        usePagination
    };
});

jest.mock('@apollo/client', () => {
    const useQuery = jest.fn().mockReturnValue({
        data: {
            __type: {
                inputFields: []
            }
        },
        error: null,
        loading: false
    });
    const runQuery = jest.fn();
    const queryResult = {
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
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { useLazyQuery, useQuery };
});

const mockProps = {
    queries: {
        filterIntrospection: 'filterIntrospectionQuery',
        getProductFiltersBySearch: 'getProductFiltersBySearchQuery',
        productSearch: 'productSearchQuery'
    }
};

const Component = props => {
    const talonProps = useSearchPage(props);
    return <i talonProps={talonProps} />;
};

const tree = createTestInstance(<Component {...mockProps} />);

test('returns the correct shape', () => {
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
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
        act(() => {
            tree.update(<Component {...mockProps} />);
        });

        expect(mockSetCurrentPage).toHaveBeenCalledTimes(expected);
    }
);

describe('searchCategory', () => {
    const log = jest.fn();
    const Component = props => {
        const talonProps = useSearchPage({ ...props });

        useEffect(() => {
            log(talonProps);
        }, [talonProps]);

        return <i talonProps={talonProps} />;
    };

    test('is null when no filters exist', () => {
        // Arrange.
        getFiltersFromSearch.mockReturnValueOnce(new Map());

        // Act.
        createTestInstance(<Component {...mockProps} />);

        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toBeNull();
    });

    test('is null when category_id doesnt exist', () => {
        // Arrange.
        const map = new Map().set('not_category_id', 'unit test');
        getFiltersFromSearch.mockReturnValueOnce(map);

        // Act.
        createTestInstance(<Component {...mockProps} />);

        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toBeNull();
    });

    test('is correct when a single category filter exists', () => {
        // Arrange.
        const map = new Map().set('category_id', new Set(['Bottoms,11']));
        getFiltersFromSearch.mockReturnValueOnce(map);

        // Act.
        createTestInstance(<Component {...mockProps} />);

        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toEqual('Bottoms');
    });

    test('is correct when multiple category filters exist', () => {
        // Arrange.
        const map = new Map().set(
            'category_id',
            new Set(['Bottoms,11', 'Skirts,12'])
        );
        getFiltersFromSearch.mockReturnValueOnce(map);

        // Act.
        createTestInstance(<Component {...mockProps} />);

        // Assert.
        const { searchCategory } = log.mock.calls[0][0];
        expect(searchCategory).toEqual('Bottoms, Skirts');
    });
});
