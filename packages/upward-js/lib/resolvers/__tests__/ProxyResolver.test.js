jest.mock('http-proxy-middleware');
const ProxyResolver = require('../ProxyResolver');
const proxyMiddleware = require('http-proxy-middleware');
const { globalAgent } = require('https');

beforeEach(() => {
    proxyMiddleware.mockReset();
    ProxyResolver.servers.clear();
});

test('resolverType is proxy', () =>
    expect(ProxyResolver.resolverType).toBe('proxy'));

test('telltale is target', () => expect(ProxyResolver.telltale).toBe('target'));

test('throws if no target provided', async () => {
    await expect(new ProxyResolver().resolve({})).rejects.toThrow(
        'URL argument is required'
    );
});

test('throws if target arg is not a URL', async () => {
    const visitor = {
        upward(dfn, name) {
            return {
                nine: 9,
                urlObj: {
                    notA: 'url'
                }
            }[dfn[name]];
        }
    };
    await expect(
        new ProxyResolver(visitor).resolve({
            target: 'nine'
        })
    ).rejects.toThrow();
    await expect(
        new ProxyResolver(visitor).resolve({
            target: 'urlObj'
        })
    ).rejects.toThrow();
});

test('uses globalAgent when target is HTTPS and ignoreSSLErrors is false', async () => {
    const server = {};
    proxyMiddleware.mockReturnValueOnce(server);
    const reflectVisitor = {
        upward(dfn, name) {
            return dfn[name];
        }
    };
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target: 'https://localhost:8080'
        })
    ).resolves.toBe(server);
    expect(proxyMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
            agent: globalAgent
        })
    );
});

test('uses custom agent when target is HTTPS and ignoreSSLErrors is true', async () => {
    const server = {};
    proxyMiddleware.mockReturnValueOnce(server);
    const reflectVisitor = {
        upward(dfn, name) {
            return dfn[name];
        }
    };
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target: 'https://localhost:8080',
            ignoreSSLErrors: true
        })
    ).resolves.toBe(server);
    expect(proxyMiddleware.mock.calls[0][0]).not.toMatchObject({
        agent: globalAgent
    });
});

test('uses no agent when target is HTTP', async () => {
    const server = {};
    proxyMiddleware.mockReturnValueOnce(server);
    const reflectVisitor = {
        upward(dfn, name) {
            return dfn[name];
        }
    };
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target: 'http://localhost:5000'
        })
    ).resolves.toBe(server);
    expect(proxyMiddleware.mock.calls[0][0]).toHaveProperty('agent', null);
});

test('adds auth when URL object contains it', async () => {
    const server = {};
    proxyMiddleware.mockReturnValueOnce(server);
    const reflectVisitor = {
        upward(dfn, name) {
            return dfn[name];
        }
    };
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target: 'https://me:password1@localhost:8000/'
        })
    ).resolves.toBe(server);
    expect(proxyMiddleware.mock.calls[0][0]).toHaveProperty(
        'auth',
        'me:password1'
    );
});

test('caches servers already directed to this target', async () => {
    const server = {};
    proxyMiddleware.mockReturnValueOnce(server);
    const reflectVisitor = {
        upward(dfn, name) {
            return dfn[name];
        }
    };
    const target = 'https://localhost:7644/';
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target
        })
    ).resolves.not.toThrow();
    expect(proxyMiddleware).toHaveBeenCalledTimes(1);
    await expect(
        new ProxyResolver(reflectVisitor).resolve({
            target
        })
    ).resolves.not.toThrow();
    expect(proxyMiddleware).toHaveBeenCalledTimes(1);

    const cachedServer = ProxyResolver.servers.get(target);
    expect(cachedServer).toBe(server);
});
