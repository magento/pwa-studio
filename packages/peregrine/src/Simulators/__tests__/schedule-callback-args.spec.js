import scheduleCallbackArgs from '../schedule-callback-args';

beforeAll(() => {
    jest.useFakeTimers();
});

beforeEach(() => {
    setTimeout.mockClear();
});

test('errors if no schedule or no callback', () => {
    const scheduleErrorText = 'First argument must be an array';
    const cbErrorText = 'Must provide a callback';
    expect(() => scheduleCallbackArgs()).toThrow(scheduleErrorText);
    expect(() => scheduleCallbackArgs([])).toThrow(scheduleErrorText);

    expect(() => scheduleCallbackArgs([{ elapsed: 0, args: [] }])).toThrow(
        cbErrorText
    );
    expect(() => scheduleCallbackArgs([{ elapsed: 0, args: [] }], {})).toThrow(
        cbErrorText
    );

    expect(() => scheduleCallbackArgs(null, () => {})).toThrow(
        scheduleErrorText
    );
});

test('does not invoke callback synchronously', () => {
    const callback = jest.fn().mockName('callback');
    scheduleCallbackArgs([{ elapsed: 0, args: [] }], callback);

    expect(setTimeout).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
});

test('invokes callback asynchronously on timer', () => {
    const callback = jest.fn().mockName('callback');
    scheduleCallbackArgs([{ elapsed: 1, args: [] }], callback);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1);
    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
});

test('invokes callback at or around specified time', () => {
    const callback = jest.fn().mockName('callback');
    scheduleCallbackArgs([{ elapsed: 500, args: [] }], callback);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);

    jest.advanceTimersByTime(400);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalled();
});

test('passes args, preserving identity', () => {
    const callback = jest.fn().mockName('callback');
    const aParticularObject = {};
    const aParticularFn = () => {};
    const schedule = [
        { elapsed: 0, args: [aParticularObject, aParticularFn] },
        { elapsed: 4000, args: [aParticularFn, aParticularObject] }
    ];
    scheduleCallbackArgs(schedule, callback);

    expect(callback).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(aParticularObject, aParticularFn);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(aParticularFn, aParticularObject);
});

test('passes args returned from schedule callbacks', () => {
    const callback = jest.fn().mockName('callback');
    const argsFac = () => ['generated', 'args'];
    const schedule = [
        { elapsed: 1000, args: ['literal', 'args'] },
        { elapsed: 4000, args: argsFac }
    ];
    scheduleCallbackArgs(schedule, callback);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('literal', 'args');
    expect(callback).toHaveBeenLastCalledWith('generated', 'args');
});

test('cancels pending when .cancel() method is called on return obj', () => {
    const callback = jest.fn().mockName('callback');
    let pending;
    const pend = () => {
        pending = scheduleCallbackArgs(
            [
                { elapsed: 0, args: ['happens'] },
                { elapsed: 100, args: ['happens again'] },
                { elapsed: 200, args: ['never happens'] }
            ],
            callback
        );
    };

    pend();
    jest.advanceTimersByTime(50);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('happens');
    expect(pending).toMatchObject({
        cancel: expect.any(Function)
    });

    pending.cancel();
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('happens');
});

test('cancel throws if called twice', () => {
    const callback = jest.fn().mockName('callback');
    pending = scheduleCallbackArgs(
        [
            { elapsed: 0, args: ['happens'] },
            { elapsed: 100, args: ['happens again'] },
            { elapsed: 200, args: ['never happens'] }
        ],
        callback
    );

    pending.cancel();
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    expect(pending.cancel).toThrow('already canceled');
});

test('throws an error in the callback by default', () => {
    const callback = jest.fn().mockName('callback');
    callback.mockImplementationOnce(() => {
        throw new Error('oh nooooo');
    });

    expect(() =>
        scheduleCallbackArgs([{ elapsed: 5000, args: ['hates it'] }], callback)
    ).not.toThrow();

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).toThrow('oh nooooo');
});

test('throws an error in the args getter by default', () => {
    const callback = jest.fn().mockName('callback');

    expect(() =>
        scheduleCallbackArgs(
            [
                {
                    elapsed: 5000,
                    args: () => {
                        throw new Error('whaaaat');
                    }
                }
            ],
            callback
        )
    ).not.toThrow();

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).toThrow('whaaaat');
});

test('throws an error if args getter returns a non-array', () => {
    const callback = jest.fn().mockName('callback');

    expect(() =>
        scheduleCallbackArgs(
            [{ elapsed: 5000, args: () => 'not an array' }],
            callback
        )
    ).not.toThrow();

    expect(jest.runAllTimers).toThrow('did not return an array');
});

test('passes an error in the callback to a custom handler', () => {
    const callback = jest.fn().mockName('callback');
    const errorHandler = jest.fn().mockName('errorHandler');
    callback.mockImplementationOnce(() => {
        throw new Error('oh nooooo');
    });

    expect(() =>
        scheduleCallbackArgs(
            [{ elapsed: 5000, args: ['hates it'] }],
            callback,
            errorHandler
        )
    ).not.toThrow();

    expect(errorHandler).not.toHaveBeenCalled();

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).not.toThrow('oh nooooo');

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    expect(errorHandler.mock.calls[0][0].message).toMatch('oh nooooo');
});

test('passes an error in the args getter to a custom handler', () => {
    const callback = jest.fn().mockName('callback');
    const errorHandler = jest.fn().mockName('errorHandler');

    expect(() =>
        scheduleCallbackArgs(
            [
                {
                    elapsed: 5000,
                    args: () => {
                        throw new Error('whaaaat');
                    }
                }
            ],
            callback,
            errorHandler
        )
    ).not.toThrow();

    // This tests whether the React component throws an error when the timeout
    // resolves. It looks strange, but when jest.fakeTimers are in use, we can
    // trigger a fake timeout *synchronously*. That enables us to test async
    // errors when they would normally be hard to catch.
    expect(jest.runAllTimers).not.toThrow('whaaaat');

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    expect(errorHandler.mock.calls[0][0].message).toMatch('whaaa');
});

test('passes an error to a custom handler if args getter returns a non-array', () => {
    const callback = jest.fn().mockName('callback');
    const errorHandler = jest.fn().mockName('errorHandler');

    expect(() =>
        scheduleCallbackArgs(
            [{ elapsed: 5000, args: () => 'not an array' }],
            callback,
            errorHandler
        )
    ).not.toThrow();

    expect(errorHandler).not.toHaveBeenCalled;

    expect(jest.runAllTimers).not.toThrow();

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    expect(errorHandler.mock.calls[0][0].message).toMatch('not an array');
});
