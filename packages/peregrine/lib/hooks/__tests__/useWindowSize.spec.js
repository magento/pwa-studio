import React from 'react';
import { act } from 'react-test-renderer';

import { useEventListener } from '../useEventListener';
import { WindowSizeContextProvider, useWindowSize } from '../useWindowSize';
import createTestInstance from '../../util/createTestInstance';

jest.mock('../useEventListener', () => ({
    useEventListener: jest.fn()
}));

const Component = () => {
    useWindowSize();

    return <i />;
};

test('adds an event listener to the window on mount', () => {
    createTestInstance(
        <WindowSizeContextProvider>
            <Component />
        </WindowSizeContextProvider>
    );

    expect(useEventListener).toHaveBeenCalledWith(
        window,
        'resize',
        expect.any(Function)
    );
});

test('removes the event listener on unmount', () => {
    const instance = createTestInstance(
        <WindowSizeContextProvider>
            <Component />
        </WindowSizeContextProvider>
    );

    act(() => {
        instance.unmount();
    });

    expect(useEventListener).toHaveBeenCalledWith(
        window,
        'resize',
        expect.any(Function)
    );
});
