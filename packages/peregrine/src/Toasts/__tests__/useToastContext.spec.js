import React from 'react';
import { act } from 'react-test-renderer';

import { ToastContextProvider, useToastContext } from '../useToastContext';
import createTestInstance from '../../util/createTestInstance';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useReducer');

    return Object.assign(React, { useReducer: spy });
});

const log = jest.fn();

const Component = () => {
    const [state, dispatch] = useToastContext();
    log(...[state, dispatch]);

    return <i />;
};

test('returns state and dispatch', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            toasts: expect.any(Map)
        },
        expect.any(Function)
    );
});

test('handles multiple unique `add` actions', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    const firstToastPayload = {
        id: 1,
        timestamp: Date.now(),
        removalTimeoutId: 2
    };
    const secondToastPayload = {
        id: 2,
        timestamp: Date.now(),
        removalTimeoutId: 3
    };
    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload: firstToastPayload,
            type: 'add'
        });
    });

    act(() => {
        dispatch({
            payload: secondToastPayload,
            type: 'add'
        });
    });

    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            toasts: expect.any(Map)
        },
        expect.any(Function)
    );
    const toastMap = new Map();
    toastMap.set(1, {
        ...firstToastPayload,
        timestamp: expect.any(Number),
        isDuplicate: false
    });

    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );

    toastMap.set(2, {
        ...secondToastPayload,
        timestamp: expect.any(Number),
        isDuplicate: false
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );
});

test('handles duplicate `add` actions', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    const payload = {
        id: 1,
        timestamp: expect.any(Number),
        removalTimeoutId: 2
    };

    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });
    const toastMap = new Map();

    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );

    toastMap.set(1, {
        ...payload,
        timestamp: expect.any(Number),
        isDuplicate: false
    });

    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );

    toastMap.set(1, {
        ...payload,
        timestamp: expect.any(Number),
        isDuplicate: true
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );
});

test('handles `remove` action for non-existant toasts', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    const payload = {
        id: 1
    };
    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload,
            type: 'remove'
        });
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: new Map()
        },
        expect.any(Function)
    );
});

test('handles `remove` action for existing toasts', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    const payload = {
        id: 1,
        timestamp: Date.now(),
        removalTimeoutId: 2
    };
    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });

    const toastMap = new Map();
    toastMap.set(1, {
        ...payload,
        isDuplicate: false,
        timestamp: expect.any(Number)
    });

    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );

    act(() => {
        dispatch({
            payload: { id: payload.id },
            type: 'remove'
        });
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: new Map()
        },
        expect.any(Function)
    );
});

test('sets duplicate to false for remaining toasts on removal', () => {
    createTestInstance(
        <ToastContextProvider>
            <Component />
        </ToastContextProvider>
    );

    const payload = {
        id: 1,
        timestamp: Date.now(),
        removalTimeoutId: 2
    };
    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });

    act(() => {
        dispatch({
            payload: { ...payload, id: 3 },
            type: 'add'
        });
    });
    const toastMap = new Map();
    toastMap.set(1, {
        ...payload,
        isDuplicate: true,
        timestamp: expect.any(Number)
    });

    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );

    act(() => {
        dispatch({
            payload: { id: payload.id },
            type: 'remove'
        });
    });

    toastMap.set(3, {
        ...payload,
        isDuplicate: false,
        timestamp: expect.any(Number),
        id: 3
    });

    expect(log).toHaveBeenNthCalledWith(
        4,
        {
            toasts: toastMap
        },
        expect.any(Function)
    );
});
