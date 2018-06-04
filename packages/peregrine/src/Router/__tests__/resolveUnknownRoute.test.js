import resolveUnknownRoute from '../resolveUnknownRoute';

const urlResolverRes = type =>
    JSON.stringify({
        data: {
            urlResolver: { type }
        }
    });

test('Happy path: resolves w/ rootChunkID and rootModuleID for first matching component found', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT'));
    fetch.mockResponseOnce(
        JSON.stringify({
            Category: {
                rootChunkID: 2,
                rootModuleID: 100,
                pageTypes: ['CATEGORY']
            },
            Product: {
                rootChunkID: 1,
                rootModuleID: 99,
                pageTypes: ['PRODUCT'] // match
            }
        })
    );

    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(res.rootChunkID).toBe(1);
    expect(res.rootModuleID).toBe(99);
    fetch.resetMocks();
});
