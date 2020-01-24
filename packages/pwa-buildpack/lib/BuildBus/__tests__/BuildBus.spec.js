jest.mock('pertain');
const { SyncHook } = require('tapable');
const pertain = require('pertain');
const BuildBus = require('../');
jest.spyOn(console, 'warn');

const mockTargets = {
    declares3: new SyncHook(),
    declaresandintercepts2: new SyncHook()
};
const mockInterceptors = {
    declaresandintercepts2: jest.fn(),
    intercepts1: jest.fn()
};
const mockHandlers = {
    intercepts1: {
        intercept: jest.fn(api =>
            mockInterceptors.intercepts1(
                api.getTarget('declares3', 'declares3Target')
            )
        )
    },
    declaresandintercepts2: {
        declare: jest.fn(api =>
            api.declareTarget(
                'declaresandintercepts2Target',
                mockTargets.declaresandintercepts2
            )
        ),
        intercept: jest.fn(api =>
            mockInterceptors.declaresandintercepts2(
                api.getTarget('declares3', 'declares3Target'),
                api.getTarget('declaresandintercepts2Target')
            )
        )
    },
    declares3: {
        declare: jest.fn(api =>
            api.declareTarget('declares3Target', mockTargets.declares3)
        )
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
    handlerList.forEach(handlerMock => handlerMock.mockClear());
});

test('will not let you construct it by itself', () => {
    expect(() => new BuildBus()).toThrowErrorMatchingSnapshot();
    expect(() => BuildBus.create('./')).not.toThrow();
});

test('calls declare and then intercept', () => {
    BuildBus.create('./');
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
    BuildBus.create('./');
    expect(mockInterceptors.declaresandintercepts2).toHaveBeenCalledWith(
        mockTargets.declares3,
        mockTargets.declaresandintercepts2
    );
    expect(mockInterceptors.intercepts1).toHaveBeenCalledWith(
        mockTargets.declaresandintercepts2
    );
});

test('errors if declared target is not a hook', () => {
    mockHandlers.declares3.declare.mockImplementationOnce(api =>
        api.declareTarget('bad!', new Date())
    );
    expect(() => BuildBus.create('./')).toThrowErrorMatchingSnapshot();
    mockHandlers.declares3.declare.mockImplementationOnce(api =>
        api.declareTarget('worse!', null)
    );
    expect(() => BuildBus.create('./')).toThrowErrorMatchingSnapshot();
});

test('warns but does not error if declaring not in declare phase', () => {
    mockHandlers.intercepts1.intercept.mockImplementationOnce(api =>
        api.declareTarget('foo', new SyncHook())
    );
    expect(() => BuildBus.create('./')).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
});

test('warns but does not error if getting target not in intercept phase', () => {
    mockHandlers.declaresandintercepts2.declare.mockImplementationOnce(api =>
        api.getTarget('declaresandintercepts2Target')
    );
    expect(() => BuildBus.create('./')).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
});

test('errors if requested target source does not exist', () => {
    const bus = BuildBus.create('./');
    expect(() => bus.requestTargets('foo')).toThrowErrorMatchingSnapshot();
    expect(() =>
        bus.requestTargets('foo', 'bar')
    ).toThrowErrorMatchingSnapshot();
});
