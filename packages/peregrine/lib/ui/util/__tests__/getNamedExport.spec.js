import getNamedExport from '../getNamedExport';

// mock dynamic imports
async function dynamicImport() {
    return { a: 'a', default: 'b' };
}

test('retrieves a named export', async () => {
    const a = await getNamedExport(dynamicImport(), 'a');

    expect(a).toBe('a');
});

test('retrieves the default export', async () => {
    const b = await getNamedExport(dynamicImport());

    expect(b).toBe('b');
});

test('throws if the module fails to resolve', () => {
    const error = new Error('Invalid namespace object provided.');

    return expect(getNamedExport(null)).rejects.toEqual(error);
});

test('throws if the binding is not present', () => {
    const error = new Error('Binding c not found.');

    return expect(getNamedExport(dynamicImport(), 'c')).rejects.toEqual(error);
});
