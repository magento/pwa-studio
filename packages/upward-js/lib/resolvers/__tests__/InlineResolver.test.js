const InlineResolver = require('../InlineResolver');

test('resolverType is inline', () =>
    expect(InlineResolver.resolverType).toBe('inline'));

test('telltale exists', () => expect(InlineResolver.telltale).toBeDefined());

test('primitive resolves with no visitor calls', async () => {
    const visitor = {
        upward: jest.fn()
    };
    const resolver = new InlineResolver(visitor);
    expect(resolver.resolve({ inline: 'a string' })).resolves.toBe('a string');
    expect(visitor.upward).not.toHaveBeenCalled();
});

test('plain object calls visitor.upward to traverse', async () => {
    const visitor = {
        upward: jest.fn(() => 'a resolved string')
    };
    const resolver = new InlineResolver(visitor);
    expect(
        resolver.resolve({ inline: { resolvedString: 'a resolved string' } })
    ).resolves.toEqual({ resolvedString: 'a resolved string' });
    expect(visitor.upward).toHaveBeenCalledWith(
        expect.objectContaining({ resolvedString: 'a resolved string' }),
        'resolvedString'
    );
});

test('non-primitive and non-plain object inline argument throws error', async () => {
    const resolver = new InlineResolver();
    expect(resolver.resolve([])).rejects.toThrow('Invalid value');
});
