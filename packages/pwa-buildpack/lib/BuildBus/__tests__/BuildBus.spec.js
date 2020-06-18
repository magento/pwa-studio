jest.mock('pertain');
const { SyncHook, SyncWaterfallHook } = require('tapable');
const pertain = require('pertain');
const BuildBus = require('../');
jest.spyOn(console, 'log');

beforeAll(() => BuildBus.enableTracking());
afterAll(() => BuildBus.disableTracking());

const hooks = {};

let song = '';
const sing = jest.fn(lyric => {
    song += lyric;
});

const oldDepsVar = process.env.BUILDBUS_DEPS_ADDITIONAL;
beforeEach(() => {
    BuildBus.clearAll();
    sing.mockClear();
    pertain.mockClear();
    hooks.bottles = new SyncHook(['beersLeft']);
    hooks.orders = new SyncWaterfallHook(['order']);
    hooks.song = new SyncWaterfallHook(['lyrics']);
    song = '';
    process.env.BUILDBUS_DEPS_ADDITIONAL = '';
});

afterAll(() => {
    if (oldDepsVar) process.env.BUILDBUS_DEPS_ADDITIONAL = oldDepsVar;
});

// mock workflow
const dependencies = new Map();
dependencies.set('singer', {
    declare(targets) {
        targets.declare({ chorus: hooks.song });
    },
    intercept(targets) {
        targets.of('bartender').beersLeft.tap(beersLeft => {
            sing(targets.own.chorus.call(beersLeft));
        });
        targets.own.chorus.tap(
            left =>
                `${left} bottles of beer on the wall\n${left} bottles of beeeeeer\n`
        );
    }
});
dependencies.set('imbiber', {
    intercept(targets) {
        targets.of('bartender').takeOrders.tap(ordered => ordered + 1);
        targets.of('singer').chorus.tap(lyrics => `${lyrics}take `);
    }
});
dependencies.set('bartender', {
    declare(targets) {
        targets.declare({ takeOrders: hooks.orders, beersLeft: hooks.bottles });
    },
    intercept(targets) {
        targets.own.beersLeft.tap(bottles => {
            const ordered = Math.max(targets.own.takeOrders.call(0), 0);
            const bottlesLeft = Math.max(bottles - ordered);
            sing(
                `${ordered} down, pass em around\n${bottlesLeft} bottles of beer on the wall!\n`
            );
            if (bottlesLeft) {
                targets.own.beersLeft.call(bottlesLeft);
            }
        });
    }
});

const allDeps = [...dependencies.entries()];

// virtual module mocker
const phasePath = (depName, phase) => `/path/to/${depName}/${phase}`;
const doMockTargetDep = (depName, phases) =>
    Object.entries(phases).forEach(([phase, fn]) =>
        jest.doMock(phasePath(depName, phase), () => fn, {
            virtual: true
        })
    );
const doMockAdditionalDep = (depName, phases) => {
    const allPhases = Object.assign({ declare() {}, intercept() {} }, phases);
    if (process.env.BUILDBUS_DEPS_ADDITIONAL) {
        process.env.BUILDBUS_DEPS_ADDITIONAL += `,${depName}`;
    } else {
        process.env.BUILDBUS_DEPS_ADDITIONAL = depName;
    }
    doMockTargetDep(depName, allPhases);
};
for (const [depName, phases] of allDeps) {
    doMockTargetDep(depName, phases);
}
pertain.mockImplementation((context, subject, getDeps) => {
    const phase = subject.split('.').pop();
    const deps = getDeps(
        allDeps
            .filter(([, subjects]) => subjects[phase])
            .map(([depName]) => depName),
        context,
        subject
    );
    return deps.map(depName => ({
        name: depName,
        path: phasePath(depName, phase),
        subject
    }));
});

test('will not let you construct it by itself', () => {
    expect(() => new BuildBus()).toThrowErrorMatchingSnapshot();
    expect(() => BuildBus.for('./fake-context')).not.toThrow();
});

test('caches buses for contexts and does not init the same bus twice', () => {
    const bus = BuildBus.for('./somewhere');
    const cachedBus = BuildBus.for('./somewhere');
    bus.init();
    cachedBus.init();
    expect(bus).toBe(cachedBus);
    expect(pertain).toHaveBeenCalledTimes(2);
});

test('can clear cache by context name', () => {
    const bus = BuildBus.for('./somewhere');
    expect(BuildBus.for('./somewhere')).toBe(bus);
    BuildBus.clear('./somewhere');
    expect(BuildBus.for('./somewhere')).not.toBe(bus);
});

test('calls declare and then intercept', () => {
    hooks.bottles.call(100);
    expect(sing).not.toHaveBeenCalled();
    BuildBus.for('./pub').init();
    hooks.bottles.call(3);
    expect(sing).toHaveBeenCalledTimes(6);
    expect(song).toBe(`3 bottles of beer on the wall
3 bottles of beeeeeer
take 1 down, pass em around
2 bottles of beer on the wall!
2 bottles of beer on the wall
2 bottles of beeeeeer
take 1 down, pass em around
1 bottles of beer on the wall!
1 bottles of beer on the wall
1 bottles of beeeeeer
take 1 down, pass em around
0 bottles of beer on the wall!
`);
});

test('reads additional deps from env var', () => {
    const orderMore = jest.fn(targets => {
        targets.of('bartender').takeOrders.tap(orders => orders + 2);
    });
    doMockAdditionalDep('keep-counting', {
        intercept: orderMore
    });

    doMockAdditionalDep('speak-digits', {
        intercept(targets) {
            const namedDigits = [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six'
            ];
            targets.of('singer').chorus.intercept({
                register(tapinfo) {
                    return {
                        ...tapinfo,
                        fn(lyrics) {
                            return tapinfo
                                .fn(lyrics)
                                .replace(
                                    /\d+/g,
                                    digits => namedDigits[parseInt(digits)]
                                );
                        }
                    };
                }
            });
        }
    });
    BuildBus.for('./fake-context').init();

    expect(orderMore).toHaveBeenCalled();

    hooks.bottles.call(6);
    expect(song).toBe(`six bottles of beer on the wall
six bottles of beeeeeer
take 3 down, pass em around
3 bottles of beer on the wall!
three bottles of beer on the wall
three bottles of beeeeeer
take 3 down, pass em around
0 bottles of beer on the wall!
`);
});

test('errors if declared target is not a hook', () => {
    doMockAdditionalDep('bad-target', {
        declare(targets) {
            targets.declare({ bad: new Date() });
        }
    });
    expect(() =>
        BuildBus.for('./fake-context').init()
    ).toThrowErrorMatchingSnapshot();
});

test('errors if declared target is not a hook', () => {
    doMockAdditionalDep('no-target', {
        declare(targets) {
            targets.declare({ bad: null });
        }
    });
    expect(() =>
        BuildBus.for('./fake-context').init()
    ).toThrowErrorMatchingSnapshot();
});

test('logs but does not error if declaring not in declare phase', () => {
    doMockAdditionalDep('declare-in-intercept', {
        intercept(targets) {
            targets.declare({ foo: new SyncHook() });
        }
    });
    expect(() => BuildBus.for('./fake-context').init()).not.toThrow();
    expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'BuildBus'
        }),
        'runPhase',
        { phase: 'declare' }
    );
});

test('logs but does not error if getting target not in intercept phase', () => {
    doMockAdditionalDep('intercept-in-declare', {
        declare(targets) {
            targets.of('bartender').takeOrders.tap(x => x);
        }
    });
    expect(() => BuildBus.for('./fake-context').init()).not.toThrow();
    expect(console.log).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'BuildBus'
        }),
        'runPhase',
        { phase: 'declare' }
    );
});

test('errors if requested target source does not exist', () => {
    const bus = BuildBus.for('./fake-context').init();
    expect(() => bus.getTargetsOf('bar')).toThrow('has not yet declared');
});
