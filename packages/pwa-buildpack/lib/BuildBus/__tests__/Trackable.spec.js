const { inspect } = require('util');
const Trackable = require('../Trackable');

const logFn = jest.fn().mockName('console.log');
beforeEach(() => logFn.mockClear());

const confirmDead = () => {
    const trackable = new Trackable();
    trackable.attach('foo', logFn);
    expect(() => trackable.toJSON()).not.toThrow();
    expect(trackable.toJSON()).toBeUndefined();
    expect(() => trackable.track('bar')).not.toThrow();
    expect(logFn).not.toHaveBeenCalled();
};

test('starts in dead mode', confirmDead);

test('switches in and out of live mode', () => {
    const trackable = new Trackable();
    Trackable.enableTracking();
    trackable.attach('foo', logFn);
    expect(trackable.toJSON()).toMatchObject({
        type: 'Trackable',
        id: 'foo'
    });
    expect(() => trackable.track('woo', 'yay')).not.toThrow();
    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'Trackable',
            id: 'foo'
        }),
        'woo',
        'yay'
    );
    Trackable.disableTracking();
    expect(() => trackable.track('aah', 'no')).not.toThrow();
    expect(logFn).toHaveBeenCalledTimes(1);
});

test('recursively builds origin object from parents', () => {
    class OldGuy extends Trackable {}
    class Patriarch extends OldGuy {}
    class Zookeeper extends Patriarch {
        toJSON() {
            const json = super.toJSON();
            json.norseName = 'Bergelmir';
            return json;
        }
    }
    const grandparent = new OldGuy();
    const parent = new Patriarch();
    const child = new Zookeeper();
    grandparent.attach('methuselah', logFn);
    parent.attach('lamech', grandparent);
    child.attach('noah', parent);

    Trackable.enableTracking();

    grandparent.track('die', { age: 969 });
    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'OldGuy',
            id: 'methuselah'
        }),
        'die',
        { age: 969 }
    );

    parent.track('beget', 'sons', 'daughters');

    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'Patriarch',
            id: 'lamech',
            parent: {
                type: 'OldGuy',
                id: 'methuselah'
            }
        }),
        'beget',
        'sons',
        'daughters'
    );

    child.track('measure', { cubits: 300 });

    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            type: 'Zookeeper',
            id: 'noah',
            norseName: 'Bergelmir',
            parent: {
                type: 'Patriarch',
                id: 'lamech',
                parent: {
                    type: 'OldGuy',
                    id: 'methuselah'
                }
            }
        }),
        'measure',
        { cubits: 300 }
    );

    Trackable.disableTracking();
});

test('limits visual recursion in util.inspect', () => {
    class Wood extends Trackable {}
    const tree = new Wood();
    const branch = new Wood();
    const twig = new Wood();
    const leaf = new Wood();
    tree.attach('tree', (origin, ...args) =>
        logFn(inspect(origin, { depth: 1 }), ...args)
    );
    branch.attach('branch', tree);
    twig.attach('twig', branch);
    leaf.attach('leaf', twig);
    Trackable.enableTracking();
    leaf.track('wind');
    Trackable.disableTracking();
    expect(logFn).toHaveBeenCalledWith(
        expect.stringContaining('Wood<branch>'),
        'wind'
    );
    const printed = logFn.mock.calls[0][0];
    expect(printed).not.toMatch('tree');
});

test('errors if tracking enabled but this trackable was not identified', () => {
    const ufo = new Trackable();
    Trackable.enableTracking();
    expect(() => ufo.toJSON()).toThrowErrorMatchingSnapshot();
    expect(() => ufo.track()).toThrowErrorMatchingSnapshot();
    Trackable.disableTracking();
});
