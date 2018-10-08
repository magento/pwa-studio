jest.mock('net');
const net = require('net');
const { EventEmitter } = require('events');

const EADDRINUSE = 'EADDRINUSE';
const EUNKNOWN = 'EUNKNOWN';
const ELISTENTIMEOUT = 'ELISTENTIMEOUT';
const ECLOSETIMEOUT = 'ECLOSETIMEOUT';
class MockServer extends EventEmitter {
    constructor({ ipv6, ipv4 } = {}) {
        super();
        this.ipv6 = ipv6;
        this.ipv4 = ipv4;
        this.listen = jest.fn(this.listen);
        this.close = jest.fn(this.close);
        this.once = jest.fn(this.once);
        this.on = jest.fn(this.on);
        this.trigger = jest.fn(this.trigger);
    }
    triggerAsync(...args) {
        Promise.resolve().then(() => this.trigger(...args));
    }
    listen(_, addr) {
        const status = (this.status =
            addr === '0.0.0.0' ? this.ipv4 : this.ipv6);
        switch (status) {
            case EADDRINUSE:
            case EUNKNOWN:
                const error = new Error(status);
                error.code = status;
                this.triggerAsync('error', error);
                break;
            case ELISTENTIMEOUT:
                break;
            default:
                this.triggerAsync('listening');
                break;
        }
        return this;
    }
    close() {
        if (this.status !== ECLOSETIMEOUT) {
            this.triggerAsync('close');
        }
    }
}

const isPortOpen = require('../is-port-open');

afterEach(() => jest.resetAllMocks());
afterAll(() => jest.restoreAllMocks());

test('detects bound ipv6 port by creating test server', async () => {
    const mockServer = new MockServer({ ipv6: EADDRINUSE });
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8888)).toBe(false);
    expect(mockServer.listen).toHaveBeenCalledWith(8888, expect.anything());
});

test('detects bound ipv4 port by creating test server', async () => {
    const mockServer = new MockServer({ ipv4: EADDRINUSE });
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8889)).toBe(false);
    expect(mockServer.listen).toHaveBeenCalledWith(8889, expect.anything());
});

test('handles when both IP families appear to be in use', async () => {
    const mockServer = new MockServer({ ipv4: EADDRINUSE, ipv6: EADDRINUSE });
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8890)).toBe(false);
});

test('detects when port is unbound', async () => {
    const mockServer = new MockServer();
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8890)).toBe(true);
});

test('handles unexpected errors', async () => {
    const mockServer = new MockServer({ ipv4: EUNKNOWN, ipv6: EUNKNOWN });
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8890)).toBe(false);
});

test('handles timeouts and closes open handlers', async () => {
    const mockServer = new MockServer({
        ipv4: ELISTENTIMEOUT,
        ipv6: ECLOSETIMEOUT
    });
    net.createServer.mockReturnValue(mockServer);
    expect(await isPortOpen(8890)).toBe(false);
    expect(mockServer.close).toHaveBeenCalledTimes(2);
});
