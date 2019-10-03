import React, { useEffect } from 'react';
import { Form, Text } from 'informed';
import { act } from 'react-test-renderer';

import { runQuery, useLazyQuery } from '@apollo/react-hooks';
import { useAutocomplete } from '../../../talons/SearchBar';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };

    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { runQuery, queryResult, useLazyQuery };
});

const log = jest.fn();

const Component = props => {
    const query = {};
    const talonProps = useAutocomplete({ ...props, query });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <i />;
};

test('runs query only when input exceeds two characters', () => {
    let formApi;

    createTestInstance(
        <Form
            getApi={api => {
                formApi = api;
            }}
        >
            <Text field="search_query" initialValue="" />
            <Component visible={true} />
        </Form>
    );

    act(() => {
        formApi.setValue('search_query', 'a');
    });
    act(() => {
        formApi.setValue('search_query', 'ab');
    });
    act(() => {
        formApi.setValue('search_query', 'abc');
    });

    expect(runQuery).toHaveBeenCalledTimes(1);
    expect(runQuery).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            variables: {
                inputText: 'abc'
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
    const data = { products: { filters: [], items: [] } };
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data, error: null, loading: false }
    ]);

    createTestInstance(
        <Form>
            <Component visible={true} />
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
    const data = { products: { filters: [], items: { length: 1 } } };
    useLazyQuery.mockReturnValueOnce([
        runQuery,
        { data, error: null, loading: false }
    ]);

    createTestInstance(
        <Form>
            <Component visible={true} />
        </Form>
    );

    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            messageType: 'RESULT_SUMMARY'
        })
    );
});
