jest.mock('redis', () => ({
    redisClient: jest.fn(() => 'redis client object')
}));
const addImgOptMiddleware = require('../addImgOptMiddleware');
const expressSharp = require('@magento/express-sharp');
const apicache = require('apicache');
const redis = require('redis');

const mockSharpMiddleware = expressSharp.__mockMiddleware;
const mockCacheMiddleware = apicache.__mockMiddleware;

let app, config, filterMiddleware, req, res;

const next = () => {};

const rewritten = '/resize/100?url=%2Fproduct.jpg&progressive=true&format=webp';

beforeEach(() => {
    filterMiddleware = undefined;
    app = {
        use: jest.fn((_, middleware) => {
            filterMiddleware = middleware;
        })
    };
    config = {
        backendUrl: 'https://examplecdn.com/',
        cacheExpires: '1 day',
        cacheDebug: false
    };
    req = {
        url: '/product.jpg?width=100&format=pjpg&auto=webp',
        query: {
            width: 100,
            format: 'pjpg',
            auto: 'webp'
        }
    };
    res = {
        set: jest.fn()
    };
});

test('attaches middleware to app', () => {
    addImgOptMiddleware(app, config);

    expect(apicache.middleware).toHaveBeenCalledWith(
        config.cacheExpires,
        expect.any(Function),
        expect.objectContaining({
            debug: config.cacheDebug,
            redisClient: undefined
        })
    );

    expect(redis.redisClient).not.toHaveBeenCalled();

    expect(expressSharp).toHaveBeenCalledWith(
        expect.objectContaining({
            baseHost: config.backendUrl
        })
    );

    expect(app.use).toHaveBeenCalledWith(mockCacheMiddleware, filterMiddleware);

    expect(filterMiddleware).toBeTruthy();
});

test('cache uses redis if supplied', () => {
    config.redisClient = 'redis client address';
    addImgOptMiddleware(app, config);
    expect(apicache.middleware).toHaveBeenCalledWith(
        config.cacheExpires,
        expect.any(Function),
        expect.objectContaining({
            redisClient: 'redis client object'
        })
    );
    expect(redis.redisClient).toHaveBeenCalledWith('redis client address');
});

test('rewrites requests with resize params to the express-sharp pattern', () => {
    addImgOptMiddleware(app, config);
    filterMiddleware(req, res, next);
    expect(req.url).toBe(rewritten);
    expect(mockSharpMiddleware).toHaveBeenCalledWith(req, res, next);
});

test('translates query parameters if present', () => {
    addImgOptMiddleware(app, config);
    req.url = '/product.jpg?width=200&otherParam=foo';
    req.query = {
        width: 200,
        otherParam: 'foo'
    };
    filterMiddleware(req, res, next);
    expect(req.url).toBe('/resize/200?otherParam=foo&url=%2Fproduct.jpg');
});

test('does nothing to URLs without resize parameters', () => {
    addImgOptMiddleware(app, config);
    const noResizeUrl = '/product.jpg?otherParam=foo';
    req.url = noResizeUrl;
    req.query = {
        otherParam: 'foo'
    };
    filterMiddleware(req, res, next);
    expect(req.url).toBe(noResizeUrl);
    expect(mockSharpMiddleware).not.toHaveBeenCalled();
});

test('recovers from missing apicache dep', () => {
    jest.resetModules();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.doMock('apicache', () => {
        throw new Error('apicache not here');
    });
    const noopt = require('../addImgOptMiddleware');
    expect(() => noopt(app, config)).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0]).toMatchSnapshot();
    console.warn.mockRestore();
});

test('recovers from missing express-sharp dep', () => {
    jest.resetModules();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.doMock('apicache');
    jest.doMock('@magento/express-sharp', () => {
        throw new Error('express-sharp was not compatible');
    });
    const noopt = require('../addImgOptMiddleware');
    expect(() => noopt(app, config)).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0]).toMatchSnapshot();
    console.warn.mockRestore();
});
