const ComputedResolver = require('../ComputedResolver');

test('resolverType is computed', () =>
    expect(ComputedResolver.resolverType).toBe('computed'));

test('telltale exists', () => expect(ComputedResolver.telltale).toBeDefined());

test('returns empty string', () => {
    const visitor = {
        upward: jest.fn()
    };
    const resolver = new ComputedResolver(visitor);
    expect(resolver.resolve()).resolves.toBe('');
});
