const UrlResolver = require('../UrlResolver');

test('resolverType is url', () => expect(UrlResolver.resolverType).toBe('url'));

test('telltale exists', () => expect(UrlResolver.telltale).toBeDefined());

test('formats a relative url', async () => {
    const pathname = '/relative/path';
    const search = '?foo=bar';
    const href = pathname + search;
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    baseUrl: false,
                    query: {
                        foo: 'bar'
                    },
                    pathname
                }[dfn[name]])
        ),
        io: {}
    };

    const relativeUrl = await new UrlResolver(visitor).resolve({
        baseUrl: 'baseUrl',
        pathname: 'pathname',
        query: 'query'
    });
    expect(relativeUrl.toString()).toBe(href);
});

test('formats an absolute url', async () => {
    const baseUrl = 'https://localhost:8976/rootAbsolute/path?foo=bar';
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    baseUrl,
                    port: 8888,
                    query: {
                        baz: 'quux'
                    }
                }[dfn[name]])
        ),
        io: {}
    };

    const absoluteUrl = await new UrlResolver(visitor).resolve({
        baseUrl: 'baseUrl',
        port: 'port',
        query: 'query'
    });
    expect(absoluteUrl.toString()).toBe(
        'https://localhost:8888/rootAbsolute/path?foo=bar&baz=quux'
    );
});

test('merges search string and query parameters', async () => {
    const baseUrl = 'https://localhost:8976/rootAbsolute/path?foo=bar';
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    baseUrl,
                    port: 8888,
                    search: 'baz=xuuq&odin=true&dva=false',
                    query: {
                        baz: 'quux'
                    }
                }[dfn[name]])
        ),
        io: {}
    };

    const absoluteUrl = await new UrlResolver(visitor).resolve({
        baseUrl: 'baseUrl',
        port: 'port',
        search: 'search',
        query: 'query'
    });
    expect(absoluteUrl.toString()).toBe(
        'https://localhost:8888/rootAbsolute/path?baz=quux&odin=true&dva=false'
    );
});

test('errors on missing arguments', async () => {
    await expect(new UrlResolver({ visitor: {} }).resolve({})).rejects.toThrow(
        'baseUrl'
    );
});

test('errors on invalid arguments', async () => {
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    baseUrl: 'https://0.0.0.0',
                    query: []
                }[dfn[name]])
        ),
        io: {}
    };
    await expect(
        new UrlResolver(visitor).resolve({
            baseUrl: 'baseUrl',
            query: 'query'
        })
    ).rejects.toThrow('plain object');
});

test('errors when setting origin properties with no hostname or base', async () => {
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    baseUrl: false,
                    port: '8999'
                }[dfn[name]])
        ),
        io: {}
    };
    await expect(
        new UrlResolver(visitor).resolve({
            baseUrl: 'baseUrl',
            port: 'port'
        })
    ).rejects.toThrow('set origin parameters');
});
