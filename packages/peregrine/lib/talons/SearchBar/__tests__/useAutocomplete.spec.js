import React, { useEffect } from 'react';
import { Form, Text } from 'informed';
import { act } from 'react-test-renderer';

import { queryApi, useQuery } from '../../../hooks/useQuery';
import { useAutocomplete } from '../../../talons/SearchBar';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('../../../hooks/useQuery', () => {
    const queryState = {
        data: null,
        error: null,
        loading: false
    };
    const queryApi = {
        resetState: jest.fn(),
        runQuery: jest.fn(),
        setLoading: jest.fn()
    };

    const useQuery = jest.fn(() => [queryState, queryApi]);

    return { queryApi, queryState, useQuery };
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

test('resets query state if not visible', () => {
    createTestInstance(
        <Form>
            <Component visible={false} />
        </Form>
    );

    expect(queryApi.resetState).toHaveBeenCalledTimes(1);
});

test('resets query state if input is invalid', () => {
    createTestInstance(
        <Form initialValues={{ search_query: '' }}>
            <Component visible={true} />
        </Form>
    );

    expect(queryApi.resetState).toHaveBeenCalledTimes(1);
});

test('sets loading, then runs query', () => {
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

    expect(queryApi.resetState).toHaveBeenCalledTimes(2);
    expect(queryApi.setLoading).toHaveBeenCalledTimes(1);
    expect(queryApi.runQuery).toHaveBeenCalledTimes(1);
    expect(queryApi.runQuery).toHaveBeenNthCalledWith(
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
    useQuery.mockReturnValueOnce([
        { data: null, error: new Error('error'), loading: false },
        queryApi
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
    useQuery.mockReturnValueOnce([
        { data: null, error: null, loading: true },
        queryApi
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
    useQuery.mockReturnValueOnce([
        { data, error: null, loading: false },
        queryApi
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
    useQuery.mockReturnValueOnce([
        { data, error: null, loading: false },
        queryApi
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
