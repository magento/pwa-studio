let devProxy;
const request = require('supertest');
const nock = require('nock');
const express = require('express');

const TARGET = 'https://proxytarget.test';
const TARGET_UNSECURE = 'http://proxytarget.test';
const logger = {};
const logMethods = ['log', 'debug', 'info', 'warn', 'error'];

beforeAll(() => {
    logMethods.forEach(method => {
        logger[method] = jest.fn();
        jest.spyOn(console, method).mockImplementation();
    });
    // We wait to require DevProxy here because DevProxy imports `http-proxy-middleware`, and
    // `http-proxy-middleware` creates a "default logger" at module definition time--that is, when
    // we require() it. The default logger destructures the console object, so it no longer holds
    // a reference to `console` itself. This makes us unable to mock `console` for the
    // `http-proxy-middleware` library if it loads before the mock does.
    devProxy = require('../DevProxy');
});

beforeEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    logMethods.forEach(method => {
        console[method].mockRestore();
    });
    nock.restore();
});

test('logs to custom logger', async () => {
    nock(TARGET)
        .get('/will-log')
        .reply(200, 'Hello world!');

    const appWithCustomLogger = express();
    appWithCustomLogger.use(
        devProxy({
            logger,
            target: TARGET
        })
    );

    await request(appWithCustomLogger).get('/will-log');

    expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('will-log')
    );
});

test('logs to console by default', async () => {
    nock(TARGET)
        .get('/will-log')
        .reply(200, 'Hello world!');
    const app = express();
    app.use(
        devProxy({
            target: TARGET
        })
    );

    await request(app).get('/will-log');

    expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('will-log')
    );
});

test('handles redirects silently when origin is same', async () => {
    nock(TARGET)
        .get('/will-proxy-to-self')
        .reply(301, '', {
            Location: TARGET + '/redirected-to'
        });

    const app = express();
    app.use(
        devProxy({
            logger,
            target: TARGET
        })
    );

    await expect(
        request(app)
            .get('/will-proxy-to-self')
            .expect(301)
            .expect('location', /redirected\-to/)
    ).resolves.toBeTruthy();
});

test('errors informatively on redirect with protocol change', async () => {
    nock(TARGET_UNSECURE)
        .get('/will-proxy-to-secure')
        .reply(301, '', {
            Location: TARGET + '/will-proxy-to-secure'
        });

    const app = express();
    app.use(
        devProxy({
            logger,
            target: TARGET_UNSECURE
        })
    );

    await expect(
        request(app).get('/will-proxy-to-secure')
    ).resolves.toMatchObject({
        status: 500,
        text: expect.stringContaining('redirected to secure HTTPS')
    });

    nock(TARGET)
        .get('/will-proxy-to-unsecure')
        .reply(301, '', {
            Location: TARGET_UNSECURE + '/will-proxy-to-unsecure'
        })
        .get('/will-proxy-to-nowhere')
        .reply(302, '', {
            Location: 'badprotocol' + TARGET + '/will-proxy-to-nowhere'
        });

    const secureApp = express();
    secureApp.use(
        devProxy({
            logger,
            target: TARGET
        })
    );

    await expect(
        request(secureApp).get('/will-proxy-to-unsecure')
    ).resolves.toMatchObject({
        status: 500,
        text: expect.stringContaining('redirected to unsecure HTTP')
    });

    await expect(
        request(secureApp).get('/will-proxy-to-nowhere')
    ).resolves.toMatchObject({
        status: 500,
        text: expect.stringContaining('redirected to unknown protocol')
    });
});
