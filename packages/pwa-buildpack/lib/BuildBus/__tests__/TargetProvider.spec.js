const TargetProvider = require('../TargetProvider');

const trackFn = jest.fn().mockName('Trackable#track');
const getExternalTargets = jest.fn().mockName('getExternalTargets');

beforeAll(() => TargetProvider.enableTracking());
afterAll(() => TargetProvider.disableTracking());
beforeEach(() => {
    trackFn.mockClear();
    getExternalTargets.mockClear();
});

const mockDep = {
    name: 'myDep'
};

test('declares targets', () => {
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    targets.phase = 'declare';
    targets.declare({
        hekyll: new targets.types.AsyncSeriesBail([]),
        jekyll: new targets.types.SyncWaterfall(['x'])
    });
    expect(targets.own.hekyll).toBeTruthy();
    expect(targets.own.jekyll).toBeTruthy();
});

test('declares targets for any hook-like object', () => {
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    targets.phase = 'declare';
    const quackLikeATapable = {
        call() {},
        intercept() {},
        tap() {},
        tapAsync() {},
        tapPromise() {}
    };
    targets.declare({
        hekyll: new targets.types.AsyncSeriesBail([]),
        jekyll: new targets.types.SyncWaterfall(['x']),
        poang: quackLikeATapable
    });
    expect(targets.own.hekyll).toBeTruthy();
    expect(targets.own.jekyll).toBeTruthy();
    expect(targets.own.poang).toBeTruthy();
});

test('warns when declaring outside declare phase', () => {
    TargetProvider.enableTracking();
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    // no phase was set!
    targets.declare({
        someTarget: new targets.types.Sync([])
    });
    expect(trackFn).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            type: 'TargetProvider',
            id: 'myDep'
        }),
        'warning',
        expect.objectContaining({
            type: 'lifecycle',
            message: expect.stringMatching('declare')
        })
    );
    TargetProvider.disableTracking();
});

test('warns when intercepting outside intercept phase', () => {
    TargetProvider.enableTracking();
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    targets.phase = 'declare';
    targets.of('myDep');
    expect(trackFn).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            type: 'TargetProvider',
            id: 'myDep'
        }),
        'warning',
        expect.objectContaining({
            type: 'lifecycle',
            message: expect.stringContaining('of(myDep) in the "declare" phase')
        })
    );
    TargetProvider.disableTracking();
});

test('errors when trying to construct non-hooks', () => {
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    const nonHooks = [
        false,
        true,
        {},
        { tapAsync() {} },
        { tap() {}, tapAsync() {} },
        { call() {} }
    ];
    nonHooks.forEach(bad => {
        expect(() => targets.declare({ bad })).toThrowErrorMatchingSnapshot();
    });
});

test('.of() creates, caches, and returns external target collection', () => {
    getExternalTargets.mockReturnValueOnce('blorf');
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    expect(targets.of('blorfable')).toBe('blorf');
    expect(targets.of('blorfable')).toBe('blorf');
});

test('.of() returns own collection where appropriate', () => {
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    expect(targets.of('myDep')).toBe(targets.own);
});

test('.own refs owner target collection', () => {
    const targets = new TargetProvider(trackFn, mockDep, getExternalTargets);
    const ownTarget = new targets.types.SyncWaterfall(['num']);
    ownTarget.tap('testing', num => num + 1);
    targets.declare({ someTarget: ownTarget });
    expect(targets.own.someTarget).toBeTruthy();
    expect(targets.own.someTarget.call(9)).toBe(10);
});
