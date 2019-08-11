import React from 'react';
import { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';

import * as RestApi from '../../RestApi';
import { useRestApi } from '../useRestApi';
import createTestInstance from '../../util/createTestInstance';

jest.mock('../useRestResponse', () => {
    const state = {
        data: null,
        error: null,
        loading: false
    };
    const api = {
        receiveError: jest.fn(),
        receiveResponse: jest.fn(),
        setLoading: jest.fn()
    };
    const useRestResponse = jest.fn(() => [state, api]);

    return { useRestResponse };
});
jest.mock('../../RestApi', () => ({
    Magento2: {
        request: jest.fn(() => 'result')
    }
}));

const log = jest.fn();
const { request } = RestApi.Magento2;
const ENDPOINT = 'https://example.test';

const TestComponent = props => {
    const { children } = props;
    const hookOutput = useRestApi(ENDPOINT);

    log(...hookOutput);

    return <i>{children}</i>;
};

test('returns response state and api', () => {
    createTestInstance(<TestComponent />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
        {
            data: null,
            error: null,
            loading: false
        },
        {
            receiveError: expect.any(Function),
            receiveResponse: expect.any(Function),
            sendRequest: expect.any(Function),
            setLoading: expect.any(Function)
        }
    );
});

test('`sendRequest` sends a request and receives a response', async () => {
    createTestInstance(<TestComponent />);

    const options = {};
    const { receiveResponse, sendRequest } = log.mock.calls[0][1];

    act(() => {
        sendRequest({ options });
    });

    await waitForExpect(() => {
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenNthCalledWith(1, ENDPOINT, options);

        expect(receiveResponse).toHaveBeenCalledTimes(1);
        expect(receiveResponse).toHaveBeenNthCalledWith(1, 'result');
    });
});

test('state and api are properly memoized', async () => {
    const instance = createTestInstance(
        <TestComponent key="foo">{'abc'}</TestComponent>
    );

    act(() => {
        instance.update(<TestComponent key="foo">{'def'}</TestComponent>);
    });

    const firstCall = log.mock.calls[0];
    const updateCall = log.mock.calls[1];
    updateCall.every((arg, index) => {
        expect(firstCall[index]).toBe(arg);
    });
});
