import { extract, fixedObserver, initObserver } from '../utils';

// mock a simple observer-type generator
function* arrayObserver() {
    let array = [];

    array.push(yield);
    array.push(yield);

    return array;
}

// mock dynamic imports
async function dynamicImport() {
    return { foo: 'foo', default: 'bar' };
}

test('`extract` retrieves a named export', async () => {
    const foo = await extract(dynamicImport(), 'foo');

    expect(foo).toBe('foo');
});

test('`extract` retrieves the default export', async () => {
    const bar = await extract(dynamicImport());

    expect(bar).toBe('bar');
});

test('`extract` throws if the module fails to resolve', () => {
    const error = new Error('Invalid namespace object provided.');

    return expect(extract(null)).rejects.toEqual(error);
});

test('`extract` throws if the binding is not present', () => {
    const error = new Error('Binding baz not found.');

    return expect(extract(dynamicImport(), 'baz')).rejects.toEqual(error);
});

test('`fixedObserver` yields undefined', () => {
    const gen = fixedObserver(2);

    expect(gen.next()).toEqual({ value: void 0, done: false });
    expect(gen.next()).toEqual({ value: void 0, done: false });
    expect(gen.next()).toEqual({ value: void 0, done: true });
});

test('`fixedObserver` terminates if `length` is 0', () => {
    const gen = fixedObserver(0);

    expect(gen.next()).toEqual({ value: void 0, done: true });
    expect(gen.next()).toEqual({ value: void 0, done: true });
});

test('`initObserver` starts an observer', () => {
    const gen = initObserver(arrayObserver)();

    expect(gen.next(0)).toEqual({ value: void 0, done: false });
    expect(gen.next(1)).toEqual({ value: [0, 1], done: true });
});
