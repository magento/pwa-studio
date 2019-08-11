import React, { useReducer } from 'react';
import { act } from 'react-test-renderer';

import { useQueryResult } from '../useQueryResult';
import createTestInstance from '../../util/createTestInstance';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useReducer');

    return Object.assign(React, { useReducer: spy });
});

const log = jest.fn();
const mockDispatch = jest.fn();

const Component = () => {
    const hookOutput = useQueryResult();

    log(...hookOutput);

    return <i />;
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
            dispatch: expect.any(Function),
            resetState: expect.any(Function),
            receiveResponse: expect.any(Function),
            setData: expect.any(Function),
            setError: expect.any(Function),
            setLoading: expect.any(Function)
        }
    );
});

test('handles `set data` action', () => {
    createTestInstance(<Component />);

    const payload = {};
    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload,
            type: 'set data'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            data: payload,
            error: null,
            loading: false
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles `set error` action', () => {
    createTestInstance(<Component />);

    const payload = new Error('foo');
    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload,
            type: 'set error'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            data: null,
            error: payload,
            loading: false
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles `set loading` action', () => {
    createTestInstance(<Component />);

    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload: true,
            type: 'set loading'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            data: null,
            error: null,
            loading: true
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles `receive response` action with data', () => {
    createTestInstance(<Component />);

    const data = {};
    const payload = { data };
    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload,
            type: 'receive response'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            data,
            error: null,
            loading: false
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles `receive response` action with error', () => {
    createTestInstance(<Component />);

    const error = new Error('foo');
    const payload = { error };
    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload,
            type: 'receive response'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            data: null,
            error,
            loading: false
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles `reset state` action', () => {
    createTestInstance(<Component />);

    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            payload: {},
            type: 'set data'
        });
    });

    act(() => {
        dispatch({
            payload: new Error('foo'),
            type: 'set error'
        });
    });

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

    expect(log).toHaveBeenCalledTimes(5);
    expect(log).toHaveBeenNthCalledWith(
        5,
        {
            data: null,
            error: null,
            loading: false
        },
        expect.objectContaining({
            dispatch
        })
    );
});

test('handles an unexpected action as a noop', () => {
    createTestInstance(<Component />);

    const { dispatch } = log.mock.calls[0][1];

    act(() => {
        dispatch({
            type: 'foo'
        });
    });

    expect(log).toHaveBeenCalledTimes(1);
});

test('`setData` dispatches a `set data` action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);
    createTestInstance(<Component />);

    const payload = {};
    const { dispatch, setData } = log.mock.calls[0][1];

    act(() => {
        setData(payload);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'set data'
    });
});

test('`setError` dispatches a `set error` action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);
    createTestInstance(<Component />);

    const payload = new Error('foo');
    const { dispatch, setError } = log.mock.calls[0][1];

    act(() => {
        setError(payload);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'set error'
    });
});

test('`setLoading` dispatches a `set loading` action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);
    createTestInstance(<Component />);

    const { dispatch, setLoading } = log.mock.calls[0][1];

    act(() => {
        setLoading(true);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload: true,
        type: 'set loading'
    });
});

test('`resetState` dispatches a `reset state` action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);
    createTestInstance(<Component />);

    const { dispatch, resetState } = log.mock.calls[0][1];

    act(() => {
        resetState();
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: 'reset state'
    });
});

test('`receiveResponse` dispatches a `receive response` action', () => {
    useReducer.mockReturnValueOnce([{}, mockDispatch]);
    createTestInstance(<Component />);

    const payload = {};
    const { dispatch, receiveResponse } = log.mock.calls[0][1];

    act(() => {
        receiveResponse(payload);
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload,
        type: 'receive response'
    });
});
