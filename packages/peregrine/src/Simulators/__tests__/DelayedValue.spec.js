import { DelayedValue } from '../';
import { createElement } from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

beforeAll(() => {
    configure({ adapter: new Adapter() });
    jest.useFakeTimers();
});

test('with no `initial` prop, renders nothing at first', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = mount(
        <DelayedValue delay={1000} updated="woah">
            {renderCallback}
        </DelayedValue>
    );

    expect(wrapper.html()).not.toBeTruthy();
    expect(renderCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1200);

    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('woah');
    expect(wrapper.update().contains(<div className="woah" />)).toBeTruthy();
});

test('with `initial` prop, renders with two calls', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = mount(
        <DelayedValue initial="immediate" delay={1500} updated="subsequent">
            {renderCallback}
        </DelayedValue>
    );

    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('immediate');
    expect(wrapper.contains(<div className="immediate" />)).toBeTruthy();

    jest.advanceTimersByTime(2000);

    expect(renderCallback).toHaveBeenCalledTimes(2);
    expect(renderCallback).toHaveBeenCalledWith('subsequent');
    expect(
        wrapper.update().contains(<div className="subsequent" />)
    ).toBeTruthy();
});

test('unmounting cancels the pending update', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = mount(
        <DelayedValue initial="incipient" delay={1000} updated="imminent">
            {renderCallback}
        </DelayedValue>
    );

    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('incipient');
    expect(wrapper.contains(<div className="incipient" />)).toBeTruthy();

    wrapper.unmount();
    jest.runAllTimers();

    expect(renderCallback).not.toHaveBeenCalledTimes(2);
    expect(renderCallback).not.toHaveBeenCalledWith('imminent');
});

test('errors throw informatively', () => {
    // to hide console errors from reporter output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mount(
        <DelayedValue delay={500} updated={{ food: 'vegetables' }}>
            {val => {
                throw new Error(`But I don't LIKE ${val.food}!`);
            }}
        </DelayedValue>
    );

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).toThrow(`subtree threw an error`);

    console.error.mockClear();
});

test('errors throw unless a custom error callback exists', () => {
    // to hide console errors from reporter output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const onError = jest.fn();
    const wrapper = mount(
        <DelayedValue
            onError={onError}
            delay={500}
            updated={{ food: 'minerals' }}
        >
            {val => {
                throw new Error(`But I don't LIKE ${val.food}!`);
            }}
        </DelayedValue>
    );

    expect(onError).not.toHaveBeenCalled();

    jest.runAllTimers();
    wrapper.update();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].message).toMatch(
        `But I don't LIKE minerals!`
    );

    console.error.mockClear();
});
