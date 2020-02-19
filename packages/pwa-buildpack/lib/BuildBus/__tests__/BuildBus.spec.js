jest.mock('pertain');
const { SyncHook, SyncWaterfallHook } = require('tapable');
const pertain = require('pertain');
const BuildBus = require('../');
jest.spyOn(console, 'log');

const mockTargets = {
    declares3: new SyncWaterfallHook(['foo']),
    declaresandintercepts2: new SyncWaterfallHook(['bar'])
};
mockTargets.declaresandintercepts2.tap('append', x => `${x}-tail`);
mockTargets.declaresandintercepts2.tap('prepend', x => `head-${x}`);
mockTargets.declares3.tap('subtract', x => x - 1);
mockTargets.declares3.tap('sing', x => `${x} bottles of beer`);

beforeAll(() => BuildBus.enableTracking());
afterAll(() => BuildBus.disableTracking());

const mockInterceptors = {
    declaresandintercepts2: jest
        .fn()
        .mockName('mockInterceptors.declaresandintercepts2')
        .mockImplementation(),
    intercepts1: jest.fn().mockName('mockInterceptors.intercepts1')
};
const mockHandlers = {
    intercepts1: {
        intercept: jest
            .fn(targets =>
                mockInterceptors.intercepts1(
                    targets.of('declares3').declares3Target
                )
            )
            .mockName('mockHandlers.intercepts1.intercept')
    },
    declaresandintercepts2: {
        declare: jest
            .fn(targets =>
                targets.declare({
                    declaresandintercepts2Target:
                        mockTargets.declaresandintercepts2
                })
            )
            .mockName('mockHandlers.declaresandintercepts2.declare'),
        intercept: jest
            .fn(targets =>
                mockInterceptors.declaresandintercepts2(
                    targets.of('declares3').declares3Target,
                    targets.own.declaresandintercepts2Target
                )
            )
            .mockName('mockHandlers.declaresandintercepts2.intercept')
    },
    declares3: {
        declare: jest
            .fn(targets =>
                targets.declare({ declares3Target: mockTargets.declares3 })
            )
            .mockName('mockHandlers.declares3.declare')
    }
};
const handlerList = [
    mockInterceptors.declaresandintercepts2,
    mockInterceptors.intercepts1
];
const mockHandlerEntries = Object.entries(mockHandlers);
mockHandlerEntries.forEach(([depName, subjects]) =>
    Object.entries(subjects).forEach(([subject, fn]) => {
        handlerList.push(fn);
        jest.doMock(`/path/to/${depName}/${subject}`, () => fn, {
            virtual: true
        });
    })
);

pertain.mockImplementation((_, subject) => {
    const phase = subject.split('.').pop();
    const deps = mockHandlerEntries.filter(([, subjects]) => subjects[phase]);
    return deps.map(([depName]) => ({
        name: depName,
        path: `/path/to/${depName}/${phase}`,
        subject
    }));
});

beforeEach(() => {
    BuildBus.clearAll();
    handlerList.forEach(handlerMock => handlerMock.mockClear());
});

test('will not let you construct it by itself', () => {
    expect(() => new BuildBus()).toThrowErrorMatchingSnapshot();
    expect(() => BuildBus.for('./fake-context')).not.toThrow();
});

test('caches buses for contexts', () => {
    expect(BuildBus.for('./somewhere')).toBe(BuildBus.for('./somewhere'));
    expect(mockHandlers.declares3.declare).toHaveBeenCalledTimes(1);
});

test('calls declare and then intercept', () => {
    BuildBus.for('./fake-context');
    expect(mockHandlers.declares3.declare).toHaveBeenCalledTimes(1);
    expect(mockHandlers.declaresandintercepts2.declare).toHaveBeenCalledTimes(
        1
    );
    expect(mockHandlers.declaresandintercepts2.intercept).toHaveBeenCalledTimes(
        1
    );
    expect(mockHandlers.intercepts1.intercept).toHaveBeenCalledTimes(1);
    const stop = mockHandlers.declaresandintercepts2.declare.mock.calls[0][0];

    expect(stop).toBe(
        mockHandlers.declaresandintercepts2.intercept.mock.calls[0][0]
    );
});

test('can intercept declared targets', () => {
    BuildBus.for('./fake-context2');
    expect(mockInterceptors.declaresandintercepts2).toHaveBeenCalled();
    expect(mockInterceptors.intercepts1).toHaveBeenCalled();
    const singing = mockTargets.declares3;
    const snake = mockTargets.declaresandintercepts2;
    expect(snake.call('egg')).toBe('head-egg-tail');
    expect(singing.call(100)).toBe('99 bottles of beer');
});

test('errors if declared target is not a hook', () => {
    mockHandlers.declares3.declare.mockImplementationOnce(targets =>
        targets.declare({ bad: new Date() })
    );
    expect(() => BuildBus.for('./fake-context')).toThrowErrorMatchingSnapshot();
    mockHandlers.declares3.declare.mockImplementationOnce(targets =>
        targets.declare({ worse: null })
    );
    expect(() =>
        BuildBus.for('./another-fake-context')
    ).toThrowErrorMatchingSnapshot();
});

test('logs but does not error if declaring not in declare phase', () => {
    mockHandlers.intercepts1.intercept.mockImplementationOnce(targets =>
        targets.declare({ foo: new SyncHook() })
    );
    expect(() => BuildBus.for('./fake-context')).not.toThrow();
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toMatchObject({
        args: ['declare'],
        event: 'runPhase',
        origin: {
            type: 'BuildBus'
        }
    });
});

test('logs but does not error if getting target not in intercept phase', () => {
    mockHandlers.declaresandintercepts2.declare.mockImplementationOnce(
        targets => targets.of('declaresandintercepts2')
    );
    expect(() => BuildBus.for('./fake-context')).not.toThrow();
    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toMatchObject({
        args: ['declare'],
        event: 'runPhase',
        origin: {
            type: 'BuildBus'
        }
    });
});

test('errors if requested target source does not exist', () => {
    const bus = BuildBus.for('./fake-context');
    expect(() => bus.getTargetsOf('bar')).toThrow('has not yet declared');
});
