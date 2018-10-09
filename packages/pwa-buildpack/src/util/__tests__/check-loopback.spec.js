jest.mock('../promisified/dns');
jest.mock('../run-as-root');
jest.mock('hostile');

const { lookup } = require('../promisified/dns');
const runAsRoot = require('../run-as-root');
const hostile = require('hostile');

const checkLoopback = require('../check-loopback');

const simulate = {
    hostResolvesLoopback({ family = 4 } = {}) {
        lookup.mockReturnValueOnce({
            address: family === 6 ? '::1' : '127.0.0.1',
            family
        });
        return simulate;
    },
    hostDoesNotResolve() {
        lookup.mockRejectedValueOnce({ code: 'ENOTFOUND' });
        return simulate;
    }
};

test('checks if hostnames resolve local, ipv4 or 6', async () => {
    simulate.hostResolvesLoopback();
    const loopbacks = await checkLoopback(['excelsior.com']);
    expect(loopbacks.has('excelsior.com')).toBe(true);
    expect(lookup).toHaveBeenCalledWith('excelsior.com');

    simulate.hostResolvesLoopback({ family: 6 });
    const v6loopbacks = await checkLoopback(['excelsior.com']);
    expect(v6loopbacks.has('excelsior.com')).toBe(true);
});

test('works on multiple hostnames', async () => {
    simulate.hostResolvesLoopback().hostResolvesLoopback();
    const loopbacks = await checkLoopback(['excelsior.com', 'reliant.com']);
    expect(loopbacks.has('excelsior.com')).toBe(true);
});

test.skip('updates /etc/hosts to make hostname local', async () => {
    lookup.mockRejectedValueOnce({ code: 'ENOTFOUND' });
    await checkLoopback(['excelsior.com']);
    expect(runAsRoot).toHaveBeenCalledTimes(1);
    const updater = runAsRoot.mock.calls[0][1];
    updater(['defiant.com', 'yamato.com']);
    expect(hostile.set).toHaveBeenCalledTimes(2);
    expect(hostile.set).toHaveBeenNthCalledWith(1, '127.0.0.1', 'defiant.com');
    expect(hostile.set).toHaveBeenNthCalledWith(2, '127.0.0.1', 'yamato.com');
});

test('dies if unexpected lookup error', async () => {
    lookup.mockRejectedValueOnce(new Error('unknown'));
    await expect(checkLoopback(['excelsior.com'])).rejects.toThrow(
        'Error trying to check'
    );
});

test('throws informative error if invalid argument', async () => {
    await expect(
        checkLoopback('wat')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"[pwa-buildpack:util:check-loopback.js] hostnames must be an array of strings"`
    );
    await expect(
        checkLoopback(['wat', {}])
    ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"[pwa-buildpack:util:check-loopback.js] hostnames must be an array of strings"`
    );
});
