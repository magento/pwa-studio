import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { act } from 'react-test-renderer';
import { useLazyQuery } from '@apollo/client';

import { useCategoryList } from '../useCategoryList';

jest.mock('@apollo/client', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { useLazyQuery };
});

const props = {
    id: 1,
    query: {}
};

const log = jest.fn();

const Component = props => {
    const talonProps = useCategoryList(props);
    log(talonProps);

    return <i />;
};

test('runs the lazy query on mount', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useLazyQuery.mockReturnValueOnce([runQuery, queryResult]);
    createTestInstance(<Component {...props} />);

    act(() => {});

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenNthCalledWith(1, {
        variables: {
            id: props.id
        }
    });
});

test('runs the lazy query when id changes', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useLazyQuery.mockReturnValue([runQuery, queryResult]);
    const instance = createTestInstance(<Component {...props} />);

    act(() => {
        instance.update(<Component {...props} id={2} />);
    });

    expect(runQuery).toHaveBeenCalledTimes(2);
    expect(runQuery).toHaveBeenNthCalledWith(2, {
        variables: {
            id: 2
        }
    });
});

test('returns the correct shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const expectedProperties = ['childCategories', 'error', 'loading'];
    const actualProperties = Object.keys(talonProps);
    expect(actualProperties.sort()).toEqual(expectedProperties.sort());
});

test('is empty when Id is not in the category list', () => {
    // Arrange: purposefully set a categoryId that isn't in the category list.
    const myProps = {
        ...props,
        id: 404
    };

    // Act.
    createTestInstance(<Component {...myProps} id={myProps.id} />);

    // Assert.
    const { data } = log.mock.calls[0][0];

    expect(data).toEqual(undefined);
});
