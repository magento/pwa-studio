import React, { useEffect, useState } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { getSearchParam } from '../useSearchParam';

import { usePagination } from '../usePagination';
import { act } from 'react-test-renderer';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return {
        ...React,
        useState: spy
    };
});
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({ push: jest.fn() })),
    useLocation: jest.fn(() => ({ search: '' }))
}));
jest.mock('../useSearchParam', () => ({
    getSearchParam: jest.fn()
}));

const log = jest.fn();
const Component = props => {
    const hookProps = usePagination({ ...props });

    useEffect(() => {
        log(hookProps);
    }, [hookProps]);

    return null;
};

const props = {
    namespace: '',
    parameter: 'page',
    initialTotalPages: 1
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith(expect.any(Array));

    const result = log.mock.calls[0][0];
    const paginationState = result[0];
    expect(paginationState).toBeInstanceOf(Object);
    expect(paginationState).toHaveProperty('currentPage');
    expect(paginationState).toHaveProperty('totalPages');

    const api = result[1];
    expect(api).toBeInstanceOf(Object);
    expect(api).toHaveProperty('setCurrentPage');
    expect(api.setCurrentPage).toBeInstanceOf(Function);
    expect(api).toHaveProperty('setTotalPages');
    expect(api.setTotalPages).toBeInstanceOf(Function);
});

describe('Pagination State', () => {
    describe('Current Page', () => {
        test('is set properly when included in props', () => {
            // Arrange: set the initialPage prop.
            const myProps = {
                ...props,
                initialPage: 7
            };

            // Act.
            createTestInstance(<Component {...myProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            expect(state.currentPage).toEqual(7);
        });

        test('it falls back to the search param if necessary', () => {
            // Arrange.
            // Note that `props` does not contain an `initialPage` prop.
            getSearchParam.mockReturnValueOnce(99);

            // Act.
            createTestInstance(<Component {...props} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            expect(state.currentPage).toEqual(99);
        });

        test('it falls back to the default if necessary', () => {
            // Arrange.
            // Note that `props` does not contain an `initialPage` prop.
            getSearchParam.mockReturnValueOnce('');

            // Act.
            createTestInstance(<Component {...props} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            // The defaultInitialPage in usePagination is 1.
            expect(state.currentPage).toEqual(1);
        });
    });

    describe('Total Pages', () => {
        test('is set properly when included in props', () => {
            // Arrange.
            const myProps = {
                ...props,
                initialTotalPages: 7
            };

            // Act.
            createTestInstance(<Component {...myProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            expect(state.totalPages).toEqual(7);
        });

        test('is given a default value when not included in props', () => {
            // Arrange: set the initialPage prop.
            const myProps = {
                ...props,
                initialTotalPages: undefined
            };

            // Act.
            createTestInstance(<Component {...myProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            // Note: One (1) is the default value in usePagination.
            expect(state.totalPages).toEqual(1);
        });
    });
});
