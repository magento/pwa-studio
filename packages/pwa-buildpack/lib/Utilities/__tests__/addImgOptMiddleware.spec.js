jest.mock('redis', () => ({
    redisClient: jest.fn(() => 'redis client object')
}));
const { parse } = require('querystring');
const addImgOptMiddleware = require('../addImgOptMiddleware');
const expressSharp = require('@magento/express-sharp');
const apicache = require('apicache');
const redis = require('redis');

const mockSharpMiddleware = expressSharp.__mockMiddleware;
const mockCacheMiddleware = apicache.__mockMiddleware;

let app;
let config;
let filterMiddleware;
let req;
let res;

const next = () => {};

const testUrl = (url, method = 'GET') => {
    addImgOptMiddleware(app, config);
    const { pathname, search } = new URL(url, 'http://localhost');
    req = {
        method,
        path: pathname,
        query: parse(search.replace(/^\?/, '')),
        url
    };
    filterMiddleware(req, res, next);
};

beforeEach(() => {
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
    res = {
        set: jest.fn(() => res),
        status: jest.fn(() => res),
        send: jest.fn(() => res)
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

test('translates plain jpeg params', () => {
    testUrl('/prog-jpeg.jpg?width=500&format=jpg');
    expect(req.query).toMatchObject({
        width: '500',
        format: 'jpeg'
    });
});

test('translates progressive jpeg params', () => {
    testUrl('/prog-jpeg.jpg?width=500&format=pjpg');
    expect(req.query).toMatchObject({
        width: '500',
        format: 'jpeg',
        progressive: true
    });
});

test('adds height and crop if width and height is present', () => {
    testUrl('/product.jpg?width=200&height=400');
    expect(req.query).toMatchObject({
        width: '200',
        height: '400',
        crop: true
    });
});

test('translates query parameters if present', () => {
    testUrl('/product.jpg?width=200&auto=webp&otherParam=foo');
    expect(req.query).toMatchObject({
        otherParam: 'foo',
        width: '200'
    });
});

test('does nothing to non-GET URLs', () => {
    testUrl('/product.jpg?width=300&format=pjpg', 'POST');
    expect(mockSharpMiddleware).not.toHaveBeenCalled();
    expect(req.query).not.toMatchObject({
        progressive: true
    });
});

test('does nothing to non-image URLs', () => {
    testUrl('/not-an-image.txt?width=300&format=pjpg');
    expect(mockSharpMiddleware).not.toHaveBeenCalled();
    expect(req.query).not.toMatchObject({
        progressive: true
    });
});

test('does nothing to urls lacking any resize parameters', () => {
    testUrl('/no-need-to-resize.png');
    expect(mockSharpMiddleware).not.toHaveBeenCalled();
    expect(req.query).not.toMatchObject({
        progressive: true
    });
});

test('sends a 500 when resize fails', () => {
    mockSharpMiddleware.mockImplementationOnce(() => {
        throw new Error(
            "this is fine, i'm ok with the events that are unfolding currently"
        );
    });
    testUrl('/product.jpg?auto=webp');
    expect(res.status).toHaveBeenCalledWith(500);
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
