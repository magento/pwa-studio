/* Deprecated in PWA-12.1.0*/

import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import { useCategoryList } from '../useCategoryList';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useQuery = jest.fn(() => queryResult);

    return {
        ...apolloClient,
        useQuery
    };
});

const props = {
    id: 1
};

const log = jest.fn();

const Component = props => {
    const talonProps = useCategoryList(props);
    log(talonProps);

    return <i />;
};

test('runs the query when id changes', () => {
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    useQuery.mockReturnValue(queryResult);
    const instance = createTestInstance(<Component {...props} />);

    act(() => {
        instance.update(<Component {...props} id={2} />);
    });

    expect(useQuery).toHaveBeenCalledTimes(4);
    expect(useQuery).toHaveBeenNthCalledWith(
        3,
        expect.any(Object),
        expect.objectContaining({
            variables: {
                id: 2
            }
        })
    );
});

test('returns the correct shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const expectedProperties = [
        'childCategories',
        'error',
        'loading',
        'storeConfig'
    ];
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
