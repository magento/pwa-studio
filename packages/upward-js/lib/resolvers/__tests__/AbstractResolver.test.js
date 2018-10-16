const AbstractResolver = require('../AbstractResolver');

test('static resolverType must be implemented', () => {
    expect(() => AbstractResolver.resolverType).toThrow('static resolverType');
});

test('resolve must be implemented', () => {
    expect(() => new AbstractResolver().resolve()).toThrow('resolve');
});
