import React from 'react';
import { act } from 'react-test-renderer';

import { useEventListener } from '../useEventListener';
import createTestInstance from '../../util/createTestInstance';

const spies = new Map();
const handleClick = jest.fn();

spies.set(
    'addEventListener',
    jest.spyOn(document, 'addEventListener').mockImplementation(jest.fn())
);
spies.set(
    'removeEventListener',
    jest.spyOn(document, 'removeEventListener').mockImplementation(jest.fn())
);

const Component = () => {
    useEventListener(document, 'click', handleClick, { once: true });

    return <i />;
};

test('adds an event listener to the document on mount', () => {
    createTestInstance(<Component />);

    const spy = spies.get('addEventListener');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'click', handleClick, {
        once: true
    });
});

test('removes the event listener on unmount', () => {
    const instance = createTestInstance(<Component />);

    act(() => {
        instance.unmount();
    });

    const spy = spies.get('removeEventListener');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'click', handleClick, {
        once: true
    });
});
