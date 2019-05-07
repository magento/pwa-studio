import React from 'react';
import { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';

import { useApolloContext } from '../useApolloContext';
import { useQuery } from '../useQuery';
import createTestInstance from '../../util/createTestInstance';

jest.mock('../useApolloContext', () => {
    const query = jest.fn(() => 'result');
    const useApolloContext = jest.fn(() => ({ query }));

    return { useApolloContext };
});

jest.mock('../useQueryResult', () => {
    const state = {
        data: null,
        error: null,
        loading: false
    };
    const api = {
        receiveResponse: jest.fn()
    };
    const useQueryResult = jest.fn(() => [state, api]);

    return { useQueryResult };
});

const log = jest.fn();
const QUERY = {};

const Component = props => {
    const { children, query } = props;
    const hookOutput = useQuery(query || QUERY);

    log(...hookOutput);

    return <i>{children}</i>;
};

test('returns query state and api', () => {
    createTestInstance(<Component />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            data: null,
            error: null,
            loading: false
        },
        {
            receiveResponse: expect.any(Function),
            runQuery: expect.any(Function)
        }
    );
});

test('`runQuery` runs a query and receives a response', async () => {
    createTestInstance(<Component />);

    const variables = {};
    const { query } = useApolloContext();
    const { receiveResponse, runQuery } = log.mock.calls[0][1];

    act(() => {
        runQuery({ variables });
    });

    await waitForExpect(() => {
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenNthCalledWith(1, {
            query: QUERY,
            variables
        });
        expect(receiveResponse).toHaveBeenCalledTimes(1);
        expect(receiveResponse).toHaveBeenNthCalledWith(1, 'result');
    });
});

test('state and api are properly memoized', async () => {
    const instance = createTestInstance(
        <Component key="foo">{'abc'}</Component>
    );

    act(() => {
        instance.update(<Component key="foo">{'def'}</Component>);
    });

    log.mock.calls[1].every((arg, index) => {
        expect(log.mock.calls[0][index]).toBe(arg);
    });
});
