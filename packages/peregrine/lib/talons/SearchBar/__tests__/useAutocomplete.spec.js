import React, { useEffect } from 'react';
import { Form, Text } from 'informed';

import { runQuery, useLazyQuery } from '@apollo/client';
import { useAutocomplete } from '../../../talons/SearchBar';
import createTestInstance from '../../../util/createTestInstance';

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
