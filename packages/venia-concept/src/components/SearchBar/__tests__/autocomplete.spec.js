import React from 'react';
import { Form, Text } from 'informed';
import { act } from 'react-test-renderer';
import { createTestInstance, useQuery } from '@magento/peregrine';

import Autocomplete from '../autocomplete';

jest.mock('src/classify');
jest.mock('@magento/peregrine');
jest.mock('../suggestions', () => () => null);
jest.doMock('react-apollo/ApolloContext', () => React.createContext());

const resetState = jest.fn();
const runQuery = jest.fn();
const setLoading = jest.fn();
runQuery.cancel = jest.fn();

const queryState = {
    data: null,
    error: null,
    loading: false
};
const queryApi = {
    resetState,
    runQuery,
    setLoading
};

useQuery.mockImplementation(() => [queryState, queryApi]);

test('renders correctly', () => {
    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={false} />
        </Form>
    );

    expect(root.findByProps({ className: 'root_hidden' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});

test('resets query state if not visible', () => {
    createTestInstance(
        <Form>
            <Autocomplete visible={false} />
        </Form>
    );

    expect(resetState).toHaveBeenCalledTimes(1);
});

test('resets query state if input is invalid', () => {
    createTestInstance(
        <Form initialValues={{ search_query: '' }}>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(resetState).toHaveBeenCalledTimes(1);
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
            <Autocomplete visible={true} />
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

    expect(resetState).toHaveBeenCalledTimes(2);
    expect(setLoading).toHaveBeenCalledTimes(1);
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
    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'message' }).children).toContain(
        'Search for a product'
    );
});

test('renders an error message', () => {
    useQuery.mockReturnValueOnce([
        { data: null, error: new Error('error'), loading: false },
        queryApi
    ]);

    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'message' }).children).toContain(
        'An error occurred while fetching results.'
    );
});

test('renders a loading message', () => {
    useQuery.mockReturnValueOnce([
        { data: null, error: null, loading: true },
        queryApi
    ]);

    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'message' }).children).toContain(
        'Fetching results...'
    );
});

test('renders an empty-set message', () => {
    const data = { products: { filters: [], items: [] } };
    useQuery.mockReturnValueOnce([
        { data, error: null, loading: false },
        queryApi
    ]);

    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'message' }).children).toContain(
        'No results were found.'
    );
});

test('renders a summary message', () => {
    const data = { products: { filters: [], items: { length: 1 } } };
    useQuery.mockReturnValueOnce([
        { data, error: null, loading: false },
        queryApi
    ]);

    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'message' }).children).toContain(
        '1 items'
    );
});
