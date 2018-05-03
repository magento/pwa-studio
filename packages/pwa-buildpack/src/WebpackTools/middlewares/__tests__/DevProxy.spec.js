jest.mock('http-proxy-middleware');

const proxyMiddleware = require('http-proxy-middleware');

const devProxy = require('../DevProxy');

test('proxies requests based on target and extension', () => {
    devProxy(
        'https://shampoo.infrequently',
        {
            passthru: ['js', 'woah', '.js.map']
        },
        'warn'
    );
    expect(proxyMiddleware).toHaveBeenCalledWith(
        ['**', '!**/*.{js,woah,js.map}'],
        expect.objectContaining({
            target: 'https://shampoo.infrequently',
            logLevel: 'warn',
            secure: false,
            changeOrigin: true
        })
    );
});

test('default loglevel is debug', () => {
    devProxy('https://condition.constantly', {
        passthru: ['js', 'woah', '.js.map']
    });
    expect(proxyMiddleware.mock.calls[0][1]).toHaveProperty(
        'logLevel',
        'debug'
    );
});
