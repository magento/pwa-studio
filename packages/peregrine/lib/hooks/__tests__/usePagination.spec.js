import React, { useEffect } from 'react';
import { push, replace } from 'react-router-dom';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import { usePagination } from '../usePagination';
import { getSearchParam } from '../useSearchParam';

jest.mock('react-router-dom', () => {
    const push = jest.fn();
    const replace = jest.fn();

    return {
        useHistory: jest.fn(() => ({ push, replace })),
        useLocation: jest.fn(() => ({ search: '' })),
        push,
        replace
    };
});
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
        test('uses the default initial page if necessary', () => {
            // Arrange.
            // Note that `localProps` does not contain an `initialPage` prop.
            const localProps = { ...props, initialTotalPages: 2 };
            getSearchParam.mockReturnValueOnce('');

            // Act.
            createTestInstance(<Component {...localProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            // The defaultInitialPage in usePagination is 1.
            expect(state.currentPage).toEqual(1);
        });

        test('uses the initial page from props if necessary', () => {
            // Arrange.
            const localProps = {
                ...props,
                initialPage: 2,
                initialTotalPages: 2
            };
            getSearchParam.mockReturnValueOnce('');

            // Act.
            createTestInstance(<Component {...localProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            expect(state.currentPage).toEqual(2);
        });

        test('prefers the page value from location if available', () => {
            // Arrange.
            const localProps = {
                ...props,
                initialPage: 2,
                initialTotalPages: 2
            };
            getSearchParam.mockReturnValueOnce('1');

            // Act.
            createTestInstance(<Component {...localProps} />);

            // Assert.
            const [state] = log.mock.calls[0][0];
            expect(state.currentPage).toEqual(1);
        });

        test('writes the value to location if necessary', async () => {
            // Arrange.
            const localProps = {
                ...props,
                initialPage: 2,
                initialTotalPages: 3
            };
            getSearchParam.mockReturnValueOnce('').mockReturnValueOnce('2');

            // Act.
            const instance = createTestInstance(<Component {...localProps} />);

            // simulate the update that router hooks would trigger
            // await it so the effect is done
            await act(() => {
                instance.update(<Component {...localProps} />);
            });

            // Assert.
            const [stateA] = log.mock.calls[0][0];
            const [stateB] = log.mock.calls[1][0];

            // two renders, but at least they're both accurate
            expect(log).toHaveBeenCalledTimes(2);
            expect(stateA.currentPage).toBe(2);
            expect(stateB.currentPage).toBe(2);

            expect(push).not.toHaveBeenCalled();
            expect(replace).toHaveBeenCalledTimes(1);
            expect(replace).toHaveBeenNthCalledWith(1, {
                search: 'page=2'
            });
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
