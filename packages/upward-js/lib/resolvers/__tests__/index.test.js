const { ResolverList, ResolversByType } = require('../');
const AbstractResolver = require('../AbstractResolver');

test('Resolvers exports', () => {
    expect(ResolverList).toBeInstanceOf(Array);
    expect(
        ResolverList.every(resolver =>
            AbstractResolver.prototype.isPrototypeOf(resolver.prototype)
        )
    ).toBeTruthy();
    expect(ResolversByType).toMatchObject({
        conditional: expect.any(Function),
        directory: expect.any(Function),
        file: expect.any(Function),
        inline: expect.any(Function),
        proxy: expect.any(Function),
        service: expect.any(Function),
        template: expect.any(Function)
    });
});
