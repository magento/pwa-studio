import React from 'react';
import { act } from 'react-test-renderer';

import { WindowSizeContextProvider, useWindowSize } from '../useWindowSize';
import createTestInstance from '../../util/createTestInstance';

const spies = new Map();

spies.set(
    'addEventListener',
    jest.spyOn(window, 'addEventListener').mockImplementation(jest.fn())
);
spies.set(
    'removeEventListener',
    jest.spyOn(window, 'removeEventListener').mockImplementation(jest.fn())
);

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

    const spy = spies.get('addEventListener');
    // React attaches a few listeners to window, we seem to always be the 5th.
    expect(spy).nthCalledWith(5, 'resize', expect.any(Function));
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

    const spy = spies.get('removeEventListener');
    // React removes a few listeners to window, we seem to always be the 6th.
    expect(spy).nthCalledWith(6, 'resize', expect.any(Function));
});
