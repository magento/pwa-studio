const { parse } = require('querystring');
const addImgOptMiddleware = require('../addImgOptMiddleware');
const hastily = require('hastily');
const apicache = require('apicache');

const mockSharpMiddleware = hastily.__mockMiddleware;
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
            debug: config.cacheDebug
        })
    );

    expect(hastily.imageopto).toHaveBeenCalled();

    expect(app.use).toHaveBeenCalledWith(mockCacheMiddleware, filterMiddleware);

    expect(filterMiddleware).toBeTruthy();
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

test('recovers from missing hastily dep', () => {
    jest.resetModules();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.doMock('apicache');
    jest.doMock('hastily', () => {
        throw new Error('hastily was not compatible');
    });
    const noopt = require('../addImgOptMiddleware');
    expect(() => noopt(app, config)).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0]).toMatchSnapshot();
    console.warn.mockRestore();
});
