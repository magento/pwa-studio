import toMap from '../toMap';

test('throws if `items` is not iterable', () => {
    const message = 'Expected `elements` to be iterable.';
    const transform = v => [v, v];
    const withUndefined = () => toMap();
    const withObject = () => toMap({}, transform);

    expect(withUndefined).toThrow(message);
    expect(withObject).toThrow(message);
});

test('throws if `transform` is not a function', () => {
    const message = 'Expected `transform` to be a function.';
    const withNull = () => toMap([], null);
    const withTrue = () => toMap([], true);

    expect(withNull).toThrow(message);
    expect(withTrue).toThrow(message);
});

test('throws if `transform does not return key-value pairs', () => {
    const message = 'Expected `transform` to return key-value pairs.';
    const input = ['a', 'b'];
    const withIdentity = () => toMap(input);

    expect(withIdentity).toThrow(message);
});

test('creates a `Map` from an array of key-value pairs', () => {
    const input = Object.entries({ a: 'b', c: 'd' });
    const output = new Map(input);

    expect(toMap(input)).toEqual(output);
});

test('uses `transform` to derive keys and values', () => {
    const transform = v => [v, v];
    const input = ['a', 'b'];
    const output = new Map().set(input[0], input[0]).set(input[1], input[1]);

    expect(toMap(input, transform)).toEqual(output);
});

test('passes the correct index to `transform`', () => {
    const transform = (v, i) => [`${i}`, v.a];
    const input = [{ a: 'b' }, { a: 'c' }];
    const output = new Map().set('0', input[0].a).set('1', input[1].a);

    expect(toMap(input, transform)).toEqual(output);
});
