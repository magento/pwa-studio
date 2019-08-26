import React from 'react';
import { act } from 'react-test-renderer';

import { useEventListener } from '../useEventListener';
import { useDropdown } from '../useDropdown';
import createTestInstance from '../../util/createTestInstance';

jest.mock('../useEventListener', () => ({
    useEventListener: jest.fn()
}));

const log = jest.fn();

const Component = () => {
    const hookProps = useDropdown();
    const { elementRef } = hookProps;

    log(hookProps);

    return <i ref={elementRef} />;
};

test('returns an object', () => {
    createTestInstance(<Component />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, {
        elementRef: expect.objectContaining({ current: null }),
        expanded: false,
        setExpanded: expect.any(Function)
    });
});

test('`setExpanded` updates `expanded`', () => {
    createTestInstance(<Component />);

    const { setExpanded } = log.mock.calls[0][0];

    act(() => {
        setExpanded(true);
    });

    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
            expanded: true
        })
    );
});

test('collapses on mousedown outside `elementRef`', () => {
    // mock the DOM API `Node.contains()` to return false
    // this simulates an event originating *outside* the target
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    // https://reactjs.org/docs/test-renderer.html#ideas
    const contains = jest.fn(() => false);
    const createNodeMock = () => ({ contains });

    createTestInstance(<Component />, { createNodeMock });

    const maybeCollapse = useEventListener.mock.calls[0][2];
    const { setExpanded } = log.mock.calls[0][0];

    act(() => {
        setExpanded(true);
    });

    act(() => {
        maybeCollapse({});
    });

    expect(log).toHaveBeenCalledTimes(3);
    expect(log).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
            expanded: false
        })
    );
});

test("doesn't collapse on mousedown inside `elementRef`", () => {
    // mock the DOM API `Node.contains()` to return true
    // this simulates an event originating *inside* the target
    const contains = jest.fn(() => true);
    const createNodeMock = () => ({ contains });

    createTestInstance(<Component />, { createNodeMock });

    const maybeCollapse = useEventListener.mock.calls[0][2];
    const { setExpanded } = log.mock.calls[0][0];

    act(() => {
        setExpanded(true);
    });

    act(() => {
        maybeCollapse({});
    });

    expect(log).toHaveBeenCalledTimes(2);
});
