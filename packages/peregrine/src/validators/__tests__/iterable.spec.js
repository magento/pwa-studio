import iterable from '../iterable';

const name = 'MyComponent';

const props = {
    b: null,
    c: '',
    d: [],
    e: new Map(),
    f: {}
};

test('returns nothing if prop is undefined', () => {
    const result = iterable(props, 'a', name);

    expect(result).toBeUndefined();
});

test('returns nothing if prop is `null`', () => {
    const result = iterable(props, 'b', name);

    expect(result).toBeUndefined();
});

test('returns an error if required and prop is undefined', () => {
    const result = iterable.isRequired(props, 'a', name);

    expect(result).toBeInstanceOf(Error);
});

test('returns an error if required and prop is `null`', () => {
    const result = iterable.isRequired(props, 'b', name);

    expect(result).toBeInstanceOf(Error);
});

test('returns nothing if prop is a string', () => {
    const result = iterable(props, 'c', name);

    expect(result).toBeUndefined();
});

test('returns nothing if prop is an array', () => {
    const result = iterable(props, 'd', name);

    expect(result).toBeUndefined();
});

test('returns nothing if prop is a Map', () => {
    const result = iterable(props, 'e', name);

    expect(result).toBeUndefined();
});

test('returns an error if prop is not iterable', () => {
    const result = iterable(props, 'f', name);

    expect(result).toBeInstanceOf(Error);
});

test('returns a proper error object', () => {
    const result = iterable(props, 'f', name);
    const thrower = () => {
        throw result;
    };

    expect(thrower).toThrow(
        'Invalid prop `f` of type `object` supplied to `MyComponent`, expected `iterable`.'
    );
});
