import { MultipleTimedRenders } from '../';
import { createElement } from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

beforeAll(() => {
    configure({ adapter: new Adapter() });
    jest.useFakeTimers();
});

test('renders children on schedule', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = shallow(
        <MultipleTimedRenders
            scheduledArgs={[
                { elapsed: 0, args: ['immediate'] },
                { elapsed: 900, args: () => ['after900', 'arg2'] }
            ]}
        >
            {renderCallback}
        </MultipleTimedRenders>
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
    expect(renderCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(800);

    expect(
        wrapper.update().contains(<div className="immediate" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('immediate');
    expect(
        wrapper.update().contains(<div className="immediate" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);

    expect(renderCallback).toHaveBeenCalledTimes(2);
    expect(renderCallback).toHaveBeenLastCalledWith('after900', 'arg2');
    expect(wrapper.update().contains(<div className="after900" />));
});

test('renders synchronously with `initial` if present', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = shallow(
        <MultipleTimedRenders
            scheduledArgs={[
                { elapsed: 0, args: ['immediate'] },
                { elapsed: 900, args: () => ['after900', 'arg2'] }
            ]}
            initialArgs={['synchronous']}
        >
            {renderCallback}
        </MultipleTimedRenders>
    );

    expect(
        wrapper.update().contains(<div className="synchronous" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('synchronous');

    jest.advanceTimersByTime(800);

    expect(
        wrapper.update().contains(<div className="immediate" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(800);

    expect(
        wrapper.update().contains(<div className="after900" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(3);
});

test('renders synchronously with `initial` callback too', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const initialArgs = jest.fn(() => ['derived']);
    const subsequentArgs = jest.fn(() => ['derived-async']);
    const wrapper = shallow(
        <MultipleTimedRenders
            scheduledArgs={[
                { elapsed: 0, args: ['immediate'] },
                { elapsed: 900, args: subsequentArgs }
            ]}
            initialArgs={initialArgs}
        >
            {renderCallback}
        </MultipleTimedRenders>
    );
    expect(initialArgs).toHaveBeenCalled();
    expect(wrapper.contains(<div className="derived" />)).toBeTruthy();
    expect(subsequentArgs).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(
        wrapper.update().contains(<div className="derived-async" />)
    ).toBeTruthy();
    expect(subsequentArgs).toHaveBeenCalled();
});

test('does not execute pending delays if unmounted', () => {
    const renderCallback = jest.fn(cls => <div className={cls} />);
    const wrapper = shallow(
        <MultipleTimedRenders
            scheduledArgs={[
                { elapsed: 0, args: ['immediate'] },
                { elapsed: 900, args: ['delayed'] }
            ]}
        >
            {renderCallback}
        </MultipleTimedRenders>
    );

    jest.advanceTimersByTime(100);

    expect(
        wrapper.update().contains(<div className="immediate" />)
    ).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('immediate');
    wrapper.unmount();
    expect(wrapper.contains(<div className="immediate" />)).toBeTruthy();
    expect(renderCallback).toHaveBeenCalledTimes(1);
    expect(renderCallback).toHaveBeenCalledWith('immediate');
});

test('errors throw informatively', () => {
    // to hide console errors from reporter output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mount(
        <MultipleTimedRenders
            scheduledArgs={[
                {
                    elapsed: 900,
                    args: () => {
                        throw new Error('woah');
                    }
                }
            ]}
        >
            {val => {
                throw new Error(`But I don't LIKE ${val.food}!`);
            }}
        </MultipleTimedRenders>
    );

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).toThrow(`Could not retrieve arguments`);

    console.error.mockClear();
});

test('errors throw unless a custom error callback exists', () => {
    // to hide console errors from reporter output
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const onError = jest.fn();
    mount(
        <MultipleTimedRenders
            scheduledArgs={[{ elapsed: 900, args: [{ food: 'minerals' }] }]}
            onError={onError}
        >
            {val => {
                throw new Error(`But I don't LIKE ${val.food}!`);
            }}
        </MultipleTimedRenders>
    );

    expect(onError).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].message).toMatch(
        `But I don't LIKE minerals!`
    );

    console.error.mockClear();
});
