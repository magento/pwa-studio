import React, { useEffect } from 'react';
import { Form, Text } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { runQuery, useLazyQuery } from '@apollo/client';
import { useAutocomplete } from '../useAutocomplete';
import createTestInstance from '../../../util/createTestInstance';
import { useEventingContext } from '../../../context/eventing';

jest.mock('informed', () => ({
    ...jest.requireActual('informed')
}));

jest.mock(
    '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper',
    () => {
        return jest.fn().mockReturnValue({
            value: ''
        });
    }
);
jest.mock('@apollo/client', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { runQuery, queryResult, useLazyQuery };
});

// Could not figure out fakeTimers. Just mock debounce and call callback.
jest.mock('lodash.debounce', () => {
    return callback => args => callback(args);
});

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const log = jest.fn();

const Component = props => {
    const queries = {};
    const talonProps = useAutocomplete({ ...props, queries });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i />;
};

test('runs query when valid is true', () => {
    createTestInstance(
        <Form>
            <Text field="search_query" initialValue="" />
            <Component valid={true} visible={true} />
        </Form>
    );

    expect(runQuery).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            variables: {
                inputText: ''
            }
        })
    );
});

test('dispatches an event when valid and visible are true and there is text value', () => {
    const [, { dispatch }] = useEventingContext();

    useFieldState.mockReturnValueOnce({
        value: 'MOCK_VALUE'
    });

    createTestInstance(
        <Form>
            <Text field="search_query" initialValue="" />
            <Component valid={true} visible={true} />
        </Form>
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0]).toMatchSnapshot();
});

test('renders a hint message', () => {
    createTestInstance(
        <Form>
            <Component visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'PROMPT'
        })
    );
});

test('renders an error message', () => {
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data: null, error: new Error('error'), loading: false }
    ]);

    createTestInstance(
        <Form>
            <Component visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'ERROR'
        })
    );
});

test('renders a loading message', () => {
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data: null, error: null, loading: true }
    ]);

    createTestInstance(
        <Form>
            <Component visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'LOADING'
        })
    );
});

test('renders an empty-set message', () => {
    const data = { products: { aggregations: [], items: [] } };
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data, error: null, loading: false }
    ]);

    createTestInstance(
        <Form>
            <Component valid={true} visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'EMPTY_RESULT'
        })
    );
});

test('renders a summary message', () => {
    const data = {
        products: { aggregations: [], items: { length: 1 }, total_count: 1 }
    };
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data, error: null, loading: false }
    ]);

    createTestInstance(
        <Form>
            <Component valid={true} visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'RESULT_SUMMARY'
        })
    );
});

test('renders a message invalid character length', () => {
    useFieldState.mockReturnValueOnce({
        value: 'MOCK_VALUE'
    });

    createTestInstance(
        <Form>
            <Text field="search_query" initialValue="a" />
            <Component valid={false} visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'INVALID_CHARACTER_LENGTH'
        })
    );
});
