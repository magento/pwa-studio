const InternalServiceResolver = require('../InternalServiceResolver');
const { ResolverList, ResolversByType } = require('..');

describe('InternalServiceResolver', () => {
    it('registers the internal_service resolver type', () => {
        expect(InternalServiceResolver.resolverType).toBe('internal_service');
    });

    it('defines the internal_service telltale', () => {
        expect(InternalServiceResolver.telltale).toBe('internal_service');
    });

    it('is included in the resolver list', () => {
        expect(ResolverList).toContain(InternalServiceResolver);
    });

    it('is registered in ResolversByType', () => {
        expect(ResolversByType.internal_service).toBe(InternalServiceResolver);
    });

    it('returns a default route response for Node.js compatibility', async () => {
        const resolver = new InternalServiceResolver({});

        await expect(resolver.resolve()).resolves.toEqual({
            data: {
                route: {
                    relative_url: '',
                    redirect_code: 404,
                    type: null
                }
            }
        });
    });
});
