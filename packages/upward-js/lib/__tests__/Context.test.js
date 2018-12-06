const Context = require('../Context');

test('promises are cached', async () => {
    const context = new Context({});
    const downward = jest.fn(async () => ({ identity: 'same' }));
    context.setVisitor({ downward });

    await Promise.all([
        expect(context.get('identity')).resolves.toBe('same'),
        expect(context.get('identity')).resolves.toBe('same')
    ]);
    expect(context._promises.size).toBe(1);
});

test('cannot set context property twice', () => {
    const context = new Context({ immu: 'table' });
    expect(() => context.set('immu', 'nized')).toThrow(
        "Attempted to reassign context property 'immu' to 'nized'. Context properties cannot be reassigned."
    );
});

test('forget() deletes ephemeral data', async () => {
    const context = new Context({ mu: 'table' });
    const downward = jest.fn(async () => ({ mu: 'nificent' }));
    context.setVisitor({ downward });

    await expect(context.get('mu')).resolves.toBe('table');
    expect(downward).not.toHaveBeenCalled();
    context.forget('mu');
    await expect(context.get('mu')).resolves.toBe('nificent');
    expect(downward).toHaveBeenCalledWith(['mu']);
});

test('constants are always present', async () => {
    const context = new Context({});
    await expect(context.get('text/plain')).resolves.toBe('text/plain');
    await expect(context.get('208')).resolves.toBe('208');
});
