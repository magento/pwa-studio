import React from 'react';
import { act } from 'react-test-renderer';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCategory } from '../useCategory';
import { useQuery } from '@apollo/client';

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
                .mockImplementation(() => mockSetCurrentPage()),
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

    return { ...apolloClient, useLazyQuery, useQuery };
});

const mockProps = {
    queries: {}
};

const mockPageSizeData = {
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

const Component = props => {
    const talonProps = useCategory(props);
    return <i talonProps={talonProps} />;
};

test('returns the correct shape', () => {
    useQuery.mockReturnValue(mockPageSizeData);

    const tree = createTestInstance(<Component {...mockProps} />);
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
        useQuery.mockReturnValue(mockPageSizeData);
        const tree = createTestInstance(<Component {...mockProps} />);

        mockUseSort.mockReturnValueOnce([sortParams, jest.fn()]);
        act(() => {
            tree.update(<Component {...mockProps} />);
        });

        expect(mockSetCurrentPage).toHaveBeenCalledTimes(expected);
    }
);
