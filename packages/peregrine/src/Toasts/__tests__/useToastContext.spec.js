import React from 'react';
import { act } from 'react-test-renderer';

import {
    ToastContextProvider,
    useToastState,
    useToastDispatch
} from '../useToastContext';
import createTestInstance from '../../util/createTestInstance';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useReducer');

    return Object.assign(React, { useReducer: spy });
});

const log = jest.fn();

beforeEach(() => {
    log.mockReset();
});
const Component = () => {
    const state = useToastState();
    const dispatch = useToastDispatch();
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
            toasts: {}
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
        removalTimeoutId: 2
    };
    const secondToastPayload = {
        id: 2,
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
            toasts: {}
        },
        expect.any(Function)
    );
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: {
                '1': {
                    ...firstToastPayload,
                    key: firstToastPayload.id,
                    timestamp: expect.any(Number),
                    duplicate: false
                }
            }
        },
        expect.any(Function)
    );
    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: {
                '1': {
                    ...firstToastPayload,
                    key: firstToastPayload.id,
                    timestamp: expect.any(Number),
                    duplicate: false
                },
                '2': {
                    ...secondToastPayload,
                    key: secondToastPayload.id,
                    timestamp: expect.any(Number),
                    duplicate: false
                }
            }
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

    expect(log).toHaveBeenNthCalledWith(
        1,
        {
            toasts: {}
        },
        expect.any(Function)
    );
    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: {
                '1': {
                    ...payload,
                    duplicate: false,
                    timestamp: expect.any(Number),
                    key: payload.id
                }
            }
        },
        expect.any(Function)
    );
    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: {
                '1': {
                    ...payload,
                    duplicate: true,
                    timestamp: expect.any(Number),
                    key: expect.any(Number) // regenerated on duplicate
                }
            }
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
            toasts: {}
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
        removalTimeoutId: 2
    };
    const [, dispatch] = log.mock.calls[0];

    act(() => {
        dispatch({
            payload,
            type: 'add'
        });
    });

    expect(log).toHaveBeenNthCalledWith(
        2,
        {
            toasts: {
                '1': {
                    ...payload,
                    duplicate: false,
                    timestamp: expect.any(Number),
                    key: payload.id
                }
            }
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
            toasts: {}
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

    expect(log).toHaveBeenNthCalledWith(
        3,
        {
            toasts: {
                '1': {
                    ...payload,
                    duplicate: true,
                    timestamp: expect.any(Number),
                    key: expect.any(Number)
                }
            }
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
        4,
        {
            toasts: {
                '3': {
                    ...payload,
                    duplicate: false,
                    timestamp: expect.any(Number),
                    id: 3,
                    key: 3
                }
            }
        },
        expect.any(Function)
    );
});
