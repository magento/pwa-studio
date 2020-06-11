import React from 'react';
import { act } from 'react-test-renderer';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import Category from '../category';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({ pathname: '', search: '' }))
}));

jest.mock('../../../components/Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title',
    Meta: () => 'Meta'
}));

jest.mock('../categoryContent', () => 'CategoryContent');

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

jest.mock('@apollo/react-hooks', () => {
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

const categoryProps = {
    id: 3,
    pageSize: 6
};
const tree = createTestInstance(<Category {...categoryProps} />);

test('renders the correct tree', () => {
    expect(tree.toJSON()).toMatchSnapshot();
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
            tree.update(<Category {...categoryProps} />);
        });

        expect(mockSetCurrentPage).toHaveBeenCalledTimes(expected);
    }
);
