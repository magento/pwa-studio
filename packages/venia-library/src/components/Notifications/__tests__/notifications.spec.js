import React from 'react';
import waitForExpect from 'wait-for-expect';
import { mount } from 'enzyme';
import MessageIcon from 'react-feather/dist/icons/message-circle';

import { Notification } from '../';

beforeEach(jest.useFakeTimers);
afterAll(jest.useRealTimers);

// Mock classes so that CSS classes are predictable.
const classes = ['success', 'warning', 'error', 'showing', 'message'].reduce(
    (cls, name) => ({
        ...cls,
        [name]: name
    }),
    {}
);

test('click-to-dismiss success notification', async () => {
    const wrapper = mount(
        <Notification
            classes={classes}
            type="success"
            onClick={(e, dismiss) => dismiss()}
        >
            Dismissable
        </Notification>
    );

    const notification = wrapper.find('button');
    expect(notification.find('.message').text()).toEqual('Dismissable');
    expect(notification.hasClass('success')).toBeTruthy();

    jest.advanceTimersByTime(Notification.SHOW_DELAY * 2);

    wrapper.update();
    expect(wrapper.find('button').hasClass('showing')).toBeTruthy();

    wrapper.find('button').simulate('click');

    await waitForExpect(() => {
        jest.runAllTimers();
        wrapper.update();
        return expect(
            wrapper.find('button').hasClass('showing')
        ).not.toBeTruthy();
    }, 2000);
    jest.useFakeTimers();
});

test('undismissable success notification', async () => {
    const wrapper = mount(
        <Notification classes={classes} type="success">
            Persistent
        </Notification>
    );

    const notification = wrapper.find('button');
    expect(notification.find('.message').text()).toEqual('Persistent');
    expect(notification.hasClass('success')).toBeTruthy();

    jest.advanceTimersByTime(Notification.SHOW_DELAY * 2);

    wrapper.update();
    expect(wrapper.find('button').hasClass('showing')).toBeTruthy();

    wrapper.find('button').simulate('click');

    jest.advanceTimersByTime(2000);
    wrapper.update();

    jest.useRealTimers();
    await waitForExpect(
        () => expect(wrapper.find('button').hasClass('showing')).toBeTruthy(),
        2000
    );
});

test('auto-dismissing warning notification', async () => {
    const wrapper = mount(
        <Notification
            classes={classes}
            type="warning"
            afterShow={(e, dismiss) => setTimeout(dismiss, 1000)}
        >
            Will dismiss in one second.
        </Notification>
    );

    const notification = wrapper.find('button');
    expect(notification.hasClass('warning')).toBeTruthy();

    jest.advanceTimersByTime(Notification.SHOW_DELAY * 2);

    wrapper.update();
    expect(wrapper.find('button').hasClass('showing')).toBeTruthy();

    // jsdom does not support transition events
    wrapper.find('button').simulate('transitionend');

    jest.runAllTimers();

    await waitForExpect(() => {
        wrapper.update();
        return expect(
            wrapper.find('button').hasClass('showing')
        ).not.toBeTruthy();
    }, 2000);
});

test('warning notification with custom icon', () => {
    const wrapper = mount(
        <Notification classes={classes} type="warning" icon={MessageIcon}>
            Custom Icon
        </Notification>
    );

    const notification = wrapper.find('button');
    expect(notification.contains(MessageIcon)).toBeTruthy();
});

test('error notification with side effect afterDismiss', async () => {
    let flag = false;
    const wrapper = mount(
        <Notification
            classes={classes}
            type="error"
            afterShow={(e, dismiss) => setTimeout(dismiss, 1000)}
            afterDismiss={() => {
                flag = true;
            }}
        >
            Will dismiss in one second with side effect.
        </Notification>
    );

    const notification = wrapper.find('button');
    expect(notification.hasClass('error')).toBeTruthy();

    jest.advanceTimersByTime(Notification.SHOW_DELAY * 2);

    wrapper.update();
    expect(wrapper.find('button').hasClass('showing')).toBeTruthy();

    // jsdom does not support transition events
    wrapper.find('button').simulate('transitionend');

    jest.advanceTimersByTime(2000);

    wrapper.find('button').simulate('transitionend');
    await waitForExpect(() => {
        wrapper.update();
        return expect(flag).toBeTruthy();
    }, 2000);
});

test('cleans up timeout', async () => {
    const wrapper = mount(
        <Notification classes={classes} type="warning" icon={MessageIcon}>
            Custom Icon
        </Notification>
    );

    const notifElement = wrapper.find('Notification').instance();

    expect(notifElement._showingTimeout).toBeTruthy();

    wrapper.unmount();

    expect(notifElement._showingTimeout).not.toBeTruthy();
});
