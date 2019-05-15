import React from 'react';
import { useToastActions } from '@magento/peregrine';

import { useToastDispatch } from '../context';
import createTestInstance from '../../util/createTestInstance';

jest.mock('../context');

const log = jest.fn();
const dispatchMock = jest.fn();
useToastDispatch.mockReturnValue(dispatchMock);

beforeEach(() => {
    log.mockReset();
    dispatchMock.mockReset();
});

test('addToast returns the id of the added toast', () => {
    const Component = ({ toastProps }) => {
        const { addToast } = useToastActions();
        const id = addToast(toastProps);
        log(id);
        return <i />;
    };

    const toastProps = {
        type: 'info'
    };

    createTestInstance(<Component toastProps={toastProps} />);

    // getToastId returns a hash. If we exported from the useToastActions
    // file we could just use it here. For now I'm just hard coding the hash.
    expect(log).toHaveBeenCalledWith(3237038);
});

test("addToast dispatches an 'add' action with expected props", () => {
    const Component = ({ toastProps }) => {
        const { addToast } = useToastActions();
        addToast(toastProps);
        return <i />;
    };

    const toastProps = {
        type: 'info'
    };

    createTestInstance(<Component toastProps={toastProps} />);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
        type: 'add',
        payload: expect.objectContaining({
            type: 'info',
            // A hash of the props.
            id: expect.any(Number),
            // Will be random, could assert by mocking setTimeout.
            removalTimeoutId: expect.any(Number),
            timestamp: expect.any(Number)
        })
    });
});

test("removeToast dispatches an 'remove' action with expected props", () => {
    const Component = ({ toastProps }) => {
        const { addToast, removeToast } = useToastActions();
        const id = addToast(toastProps);
        removeToast(id);
        return <i />;
    };

    const toastProps = {
        type: 'info'
    };

    createTestInstance(<Component toastProps={toastProps} />);

    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: 'remove',
        payload: expect.objectContaining({
            id: expect.any(Number)
        })
    });
});
