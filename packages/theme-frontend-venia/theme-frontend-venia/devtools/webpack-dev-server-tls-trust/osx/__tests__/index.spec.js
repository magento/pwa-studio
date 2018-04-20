let deathHandler;
const mockeryOfDeath = jest.fn(fn => {
    deathHandler = fn;
});
jest.doMock('death', () => arg => {
    if (typeof arg === 'function') {
        return mockeryOfDeath(arg);
    }
    return mockeryOfDeath;
});
const TempFileMock = jest.fn();
jest.doMock(
    '../../../temp-file',
    () =>
        function() {
            return TempFileMock();
        }
);
jest.doMock('../../webpack-pem');
jest.doMock('../../openssl-cli');
jest.doMock('../security-cli');
const WebpackPEM = require('../../webpack-pem');
const OpenSSLCLI = require('../../openssl-cli');
const SecurityCLI = require('../security-cli');
const logger = {
    warn: jest.fn(),
    info: jest.fn()
};
const proc = {
    exit: jest.fn(),
    on: jest.fn()
};
const fakeKeyFile = {};
const fakeCertFile = {};
const fakePassIn = {};
const fakePassOut = {};
const fakeP12 = {};
const fakeGoodPem = {};
const mockFullTrust = () => {
    WebpackPEM.prototype.write.mockImplementationOnce(() => {
        getPemInstance().exists = true;
    });
    TempFileMock.mockReturnValueOnce(fakeKeyFile).mockReturnValueOnce(
        fakeCertFile
    );
    OpenSSLCLI.createPassphrase
        .mockReturnValueOnce(fakePassIn)
        .mockReturnValueOnce(fakePassOut);
    OpenSSLCLI.prototype.createP12.mockReturnValueOnce(fakeP12);
    OpenSSLCLI.prototype.createImportablePEM.mockReturnValueOnce(fakeGoodPem);
};
const trust = require('../')(logger, proc);

const getPemInstance = () =>
    WebpackPEM.mock.instances[WebpackPEM.mock.instances.length - 1];

beforeEach(() => {
    jest.clearAllMocks();
});
test('tries to generate a new PEM', () => {
    WebpackPEM.generate.mockImplementationOnce(() => 'fakePem');
    trust();
    expect(WebpackPEM.generate).toHaveBeenCalledTimes(1);
    expect(WebpackPEM.prototype.write).toHaveBeenCalledWith('fakePem');
});
test('tries to put back an existing one if it fails', () => {
    WebpackPEM.prototype.read.mockImplementationOnce(() => {
        const self = getPemInstance();
        self.exists = true;
        self.key = 'oldKey';
        self.cert = 'oldCert';
    });
    WebpackPEM.prototype.write
        .mockImplementationOnce(() => {
            getPemInstance().exists = false;
        })
        .mockImplementationOnce(() => {
            throw Error('fail to write');
        });
    trust();
    expect(WebpackPEM.prototype.write).toHaveBeenCalledWith(
        expect.objectContaining({
            key: 'oldKey',
            cert: 'oldCert'
        })
    );
    expect(logger.warn).toHaveBeenLastCalledWith(
        expect.objectContaining({
            message: expect.stringMatching(/Could not reinstate/)
        })
    );
    WebpackPEM.prototype.write.mockImplementationOnce(() => {
        throw 'cant do nothin';
    });
    trust();
    expect(OpenSSLCLI).not.toHaveBeenCalled();
});
test('makes a cert, trusts, informs', () => {
    mockFullTrust();
    trust();
    expect(OpenSSLCLI.prototype.createP12).toHaveBeenCalledWith(
        fakeKeyFile,
        fakeCertFile,
        fakePassIn
    );
    expect(OpenSSLCLI.prototype.createImportablePEM).toHaveBeenCalledWith(
        fakeP12,
        fakePassIn,
        fakePassOut
    );
    expect(SecurityCLI.prototype.addTrustedCert).toHaveBeenCalledWith(
        fakeGoodPem
    );
    expect(logger.info).toHaveBeenLastCalledWith(
        expect.stringContaining('should now trust')
    );
    expect(mockeryOfDeath).toHaveBeenCalledTimes(1);
    expect(proc.on).toHaveBeenCalledWith('exit', expect.any(Function));
});
test('fails to trust and warns', () => {
    mockFullTrust();
    SecurityCLI.prototype.addTrustedCert.mockImplementationOnce(() => {
        throw 'woah';
    });
    trust();
    expect(logger.info).not.toHaveBeenCalledWith(
        expect.stringContaining('should now trust')
    );
    expect(mockeryOfDeath).not.toHaveBeenCalled();
    expect(proc.on).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
        'Could not add trusted cert: ',
        'woah'
    );
});
test('death handler removes trusted cert', () => {
    mockFullTrust();
    trust();
    expect(deathHandler).not.toThrow();
    expect(SecurityCLI.prototype.removeTrustedCert).toHaveBeenCalledTimes(1);
    expect(SecurityCLI.prototype.removeTrustedCert).toHaveBeenCalledWith(
        fakeGoodPem
    );
});
test('death handler fails and warns', () => {
    mockFullTrust();
    SecurityCLI.prototype.removeTrustedCert.mockImplementationOnce(() => {
        throw 'noooo';
    });
    trust();
    expect(deathHandler).not.toThrow();
    expect(logger.warn).toHaveBeenLastCalledWith(
        expect.stringContaining('Could not remove trusted cert'),
        'noooo'
    );
});
test('death handler only tries to untrust once', () => {
    mockFullTrust();
    trust();
    deathHandler();
    deathHandler();
    expect(SecurityCLI.prototype.removeTrustedCert).toHaveBeenCalledTimes(1);
});
test('death handler throws any error it receives', () => {
    expect(() => deathHandler(null, {})).not.toThrow();
    expect(() => deathHandler(null, { message: 'lol' })).not.toThrow();
    expect(() => deathHandler(null, { code: 1, message: 'lol' })).toThrow(
        'lol'
    );
});
test('exits if it receives a SIGTERM', () => {
    expect(() => deathHandler('SIGTERM')).not.toThrow();
    expect(proc.exit).toHaveBeenCalledWith(143);
});
