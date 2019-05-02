import React from 'react';
import { act } from 'react-test-renderer';

import { useWindowSize } from '../useWindowSize';
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
    createTestInstance(<Component />);

    const spy = spies.get('addEventListener');
    expect(spy).toHaveBeenCalledTimes(5);
});

test('removes the event listener on unmount', () => {
    const instance = createTestInstance(<Component />);

    act(() => {
        instance.unmount();
    });

    const spy = spies.get('removeEventListener');
    expect(spy).toHaveBeenCalledTimes(9);
});
