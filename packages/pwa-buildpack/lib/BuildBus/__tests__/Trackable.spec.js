const Trackable = require('../Trackable');

const logFn = jest.fn().mockName('console.log');
beforeEach(() => logFn.mockClear());

const confirmDead = () => {
    const trackable = new Trackable();
    trackable.identify('foo', logFn);
    expect(() => trackable.toJSON()).not.toThrow();
    expect(trackable.toJSON()).toBeUndefined();
    expect(() => trackable.track('bar')).not.toThrow();
    expect(logFn).not.toHaveBeenCalled();
};

test('starts in dead mode', confirmDead);

test('switches in and out of live mode', () => {
    const trackable = new Trackable();
    Trackable.enableTracking();
    trackable.identify('foo', logFn);
    expect(trackable.toJSON()).toMatchObject({
        type: 'Trackable',
        id: 'foo'
    });
    expect(() => trackable.track('woo', ['yay'])).not.toThrow();
    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            origin: {
                type: 'Trackable',
                id: 'foo'
            },
            event: 'woo',
            args: [['yay']]
        })
    );
    Trackable.disableTracking();
    expect(() => trackable.track('aah', ['no'])).not.toThrow();
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
    grandparent.identify('methuselah', logFn);
    parent.identify('lamech', grandparent);
    child.identify('noah', parent);

    Trackable.enableTracking();

    grandparent.track('die', { age: 969 });
    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            origin: {
                type: 'OldGuy',
                id: 'methuselah'
            },
            event: 'die',
            args: [{ age: 969 }]
        })
    );

    parent.track('beget', 'sons', 'daughters');

    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            origin: {
                type: 'Patriarch',
                id: 'lamech',
                parent: {
                    type: 'OldGuy',
                    id: 'methuselah'
                }
            },
            event: 'beget',
            args: ['sons', 'daughters']
        })
    );

    child.track('measure', { cubits: 300 });

    expect(logFn).toHaveBeenCalledWith(
        expect.objectContaining({
            origin: {
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
            },
            event: 'measure',
            args: [{ cubits: 300 }]
        })
    );

    Trackable.disableTracking();
});

test('errors if tracking enabled but this trackable was not identified', () => {
    const ufo = new Trackable();
    Trackable.enableTracking();
    expect(() => ufo.toJSON()).toThrowErrorMatchingSnapshot();
    expect(() => ufo.track()).toThrowErrorMatchingSnapshot();
    Trackable.disableTracking();
});
