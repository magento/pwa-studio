import React, { useReducer } from 'react';
import { act } from 'react-test-renderer';

import { useRestResponse } from '../useRestResponse';
import createTestInstance from '../../util/createTestInstance';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useReducer');

    return {
        ...React,
        useReducer: spy
    };
});

const log = jest.fn();
const mockDispatch = jest.fn();

const TestComponent = () => {
    const hookOutput = useRestResponse();

    log(...hookOutput);

    return <i />;
};

test('returns query state and api', () => {
    createTestInstance(<TestComponent />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            data: null,
            error: null,
            loading: false
        },
        {
            dispatch: expect.any(Function),
            receiveError: expect.any(Function),
            receiveResponse: expect.any(Function),
            resetState: expect.any(Function),
            setData: expect.any(Function),
            setError: expect.any(Function),
            setLoading: expect.any(Function)
        }
    );
});

test('handles `set data` action', () => {
    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'set data'
        });
    });

    const resultState = log.mock.calls[1][0];
    expect(resultState).toEqual(
        expect.objectContaining({
            data: payload
        })
    );
});

test('handles `set error` action', () => {
    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'set error'
        });
    });

    const resultState = log.mock.calls[1][0];
    expect(resultState).toEqual(
        expect.objectContaining({
            error: payload
        })
    );
});

test('handles `set loading` action', () => {
    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'set loading'
        });
    });

    const resultState = log.mock.calls[1][0];
    expect(resultState).toEqual(
        expect.objectContaining({
            loading: payload
        })
    );
});

test('handles `receive error` action', () => {
    createTestInstance(<TestComponent />);

    const payload = { message: 'unit test' };
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'receive error'
        });
    });

    const resultState = log.mock.calls[1][0];
    expect(resultState).toEqual({
        data: null,
        error: payload,
        loading: false
    });
});

test('handles receive response action', () => {
    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'receive response'
        });
    });

    const resultState = log.mock.calls[1][0];
    expect(resultState).toEqual({
        data: payload,
        error: null,
        loading: false
    });
});

test('handles reset state action', () => {
    createTestInstance(<TestComponent />);

    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    // Note: in order to test reset state we have to first change
    // some part of the state. If not, the component does not update.
    // Plus, we can't truly know that reset state worked.
    act(() => {
        dispatch({
            payload: true,
            type: 'set loading'
        });
    });

    act(() => {
        dispatch({
            type: 'reset state'
        });
    });

    const initialState = {
        data: null,
        error: null,
        loading: false
    };
    const resultState = log.mock.calls[2][0];
    expect(resultState).toEqual(initialState);
});

test('handles invalid action as a noop', () => {
    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { dispatch } = api;

    act(() => {
        dispatch({
            payload,
            type: 'foo'
        });
    });

    // If it is a noop, then the state will not have changed.
    // The component won't be updated,
    // meaning `log` will only have been called once.
    expect(log).toHaveBeenCalledTimes(1);
});

test('setData dispatches the "set data" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { setData } = api;

    act(() => {
        setData(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'set data'
    });
});

test('setError dispatches the "set error" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { setError } = api;

    act(() => {
        setError(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'set error'
    });
});

test('setLoading dispatches the "set loading" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { setLoading } = api;

    act(() => {
        setLoading(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'set loading'
    });
});

test('resetState dispatches the "reset state" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { resetState } = api;

    act(() => {
        resetState(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'reset state'
    });
});

test('receiveResponse dispatches the "receive response" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { receiveResponse } = api;

    act(() => {
        receiveResponse(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'receive response'
    });
});

test('receiveError dispatches the "receive error" action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);

    createTestInstance(<TestComponent />);

    const payload = {};
    const api = log.mock.calls[0][1];
    const { receiveError } = api;

    act(() => {
        receiveError(payload);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'receive error'
    });
});
