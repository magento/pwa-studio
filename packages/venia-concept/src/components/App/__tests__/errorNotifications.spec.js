import React from 'react';
import TestRenderer from 'react-test-renderer';

import ErrorNotifications from '../errorNotifications';
import { Notification } from 'src/components/Notifications';

Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn()
});

test('renders null when no errors are present', () => {
    const renderer = TestRenderer.create(
        <ErrorNotifications errors={[]} onDismissError={() => {}} />
    );

    expect(renderer.toJSON()).toBe(null);
});

test('renders an error stack when errors are present', () => {
    const instance = TestRenderer.create(
        <ErrorNotifications
            errors={[
                {
                    error: new Error('first error'),
                    id: 'Error1',
                    loc: 'stack trace here'
                },
                {
                    error: new Error('second error'),
                    id: 'Error2',
                    loc: 'stack trace here 2'
                }
            ]}
            onDismissError={() => {}}
        />
    );
    const notifications = instance.root.findAllByType(Notification);
    expect(notifications).toHaveLength(2);
    expect(notifications[0].props).toMatchObject({
        type: 'error',
        onClick: expect.any(Function),
        afterDismiss: expect.any(Function)
    });
    expect(
        notifications[0].find(({ children }) => {
            return children.includes('stack trace here');
        })
    ).toBeTruthy();
    expect(
        notifications[1].find(({ children }) => {
            return children.includes('stack trace here 2');
        })
    ).toBeTruthy();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

test('errors are dismissable', () => {
    const fakeEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
    };
    const dismissCallback = jest.fn();
    const onDismissError = jest.fn();
    const error = new Error('yup');
    const { root } = TestRenderer.create(
        <ErrorNotifications
            errors={[
                {
                    error,
                    id: 'Error1',
                    loc: 'stack trace here'
                }
            ]}
            onDismissError={onDismissError}
        />
    );
    const notification = root.findByType(Notification).instance;
    notification.props.onClick(fakeEvent, dismissCallback);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(dismissCallback).toHaveBeenCalled();
    notification.props.afterDismiss();
    expect(onDismissError).toHaveBeenCalledWith(error);
});
