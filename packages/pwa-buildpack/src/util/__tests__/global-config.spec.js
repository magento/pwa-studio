jest.mock('crypto');
jest.mock('os');
jest.mock('flat-file-db');

const crypto = require('crypto');
const os = require('os');
const flatfile = require('flat-file-db');

let GlobalConfig;

const mockHash = {
    update: jest.fn(),
    digest: jest.fn(() => 'fakeDigest')
};

const mockDb = {
    on: jest.fn((type, callback) => {
        if (type === 'open') setImmediate(callback);
    }),
    get: jest.fn(),
    put: jest.fn((k, v, cb) => setImmediate(cb)),
    del: jest.fn((k, cb) => setImmediate(cb)),
    clear: jest.fn(setImmediate),
    keys: jest.fn()
};

beforeAll(() => {
    GlobalConfig = require('../global-config');
    flatfile.mockImplementation(() => mockDb);
    os.homedir.mockReturnValue('/_HOME_');
    crypto.createHash.mockReturnValue(mockHash);
});

beforeEach(() => {
    delete GlobalConfig._dbPromise;
});

test('static getDbFilePath() creates a hidden file path global to user', () => {
    expect(GlobalConfig.getDbFilePath()).toBe(
        '/_HOME_/.config/pwa-buildpack.db'
    );
});

test('static async db() returns a Promise for a db', async () => {
    const fakeDb = await GlobalConfig.db();
    expect(flatfile).toHaveBeenCalledWith('/_HOME_/.config/pwa-buildpack.db');
    expect(mockDb.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(fakeDb).toBe(mockDb);
});

test('static async db() rejects if db open failed', async () => {
    mockDb.on.mockImplementationOnce((type, callback) => {
        if (type === 'error') {
            callback(new Error('Open failed'));
        } else if (type === 'open') {
            setImmediate(callback);
        }
    });
    await expect(GlobalConfig.db()).rejects.toThrow('Open failed');
});

test('static async db() memoizes db and only creates it once', async () => {
    const fakeDb = await GlobalConfig.db();
    const fakeDbAgain = await GlobalConfig.db();
    expect(flatfile).toHaveBeenCalledTimes(1);
    expect(fakeDb).toBe(fakeDbAgain);
});

test('static async db() rejects with underlying error if db create failed', async () => {
    flatfile.mockImplementationOnce(() => {
        throw Error('woah');
    });
    await expect(GlobalConfig.db()).rejects.toThrowError('woah');
});

test('GlobalConfig constructor throws if no conf or missing required conf', () => {
    expect(() => new GlobalConfig()).toThrow();
    expect(() => new GlobalConfig({ key: x => x })).toThrow();
    expect(
        () => new GlobalConfig({ key: 'bad key', prefix: 'good prefix' })
    ).toThrow();
    expect(
        () => new GlobalConfig({ key: () => {}, prefix: 'good prefix' })
    ).toThrow();
    expect(() => new GlobalConfig({ prefix: 'good prefix' })).not.toThrow();
    expect(
        () => new GlobalConfig({ key: x => x, prefix: 'good prefix' })
    ).not.toThrow();
});

test('.get() throws with wrong key arity', async () => {
    const cfg = new GlobalConfig({ prefix: 'test1', key: (a1, a2) => a2 });
    expect(cfg.get('arg0')).rejects.toThrowError(/number of arguments/);
});

test('.get() calls underlying flatfile', async () => {
    const cfg = new GlobalConfig({ prefix: 'test1' });
    await cfg.get('value');
    expect(crypto.createHash).toHaveBeenCalled();
    expect(mockHash.update).toHaveBeenCalledWith('value');
    expect(mockHash.digest).toHaveBeenCalled();
    expect(mockDb.get).toHaveBeenCalledWith('test1fakeDigest');
});

test('.get() dies if key function returns non-string', async () => {
    const cfg = new GlobalConfig({ prefix: 'test1', key: x => null }); // eslint-disable-line
    expect(cfg.get('value')).rejects.toThrowError(/non\-string value/);
});

test('.set() makes key from first arguments and value from last', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: (a1, a2, a3) => a1 + a2 + a3
    });
    await cfg.set('a', 'b', 'c', 'd');
    expect(mockHash.update).toHaveBeenCalledWith('abc');
    expect(mockDb.put).toHaveBeenCalledWith(
        'test1fakeDigest',
        'd',
        expect.any(Function)
    );
});

test.skip('.set() rejects with any errors passed from db', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: (a1, a2, a3) => a1 + a2 + a3
    });
    mockDb.put.mockImplementationOnce((k, v, cb) =>
        setImmediate(() => cb('bad put'))
    );
    await expect(cfg.set('a', 'b', 'c', 'd')).rejects.toThrow('bad put');
});

test('.del() makes key and calls underlying db', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: (a1, a2, a3) => a1 + a2 + a3
    });
    await cfg.del('a', 'b', 'c');
    expect(mockHash.update).toHaveBeenCalledWith('abc');
    expect(mockDb.del).toHaveBeenCalledWith(
        'test1fakeDigest',
        expect.any(Function)
    );
});

test.skip('.del() rejects with any errors passed from db', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: (a1, a2, a3) => a1 + a2 + a3
    });
    mockDb.del.mockImplementationOnce((k, cb) =>
        setImmediate(() => cb('bad del'))
    );
    await expect(cfg.del('a', 'b', 'c')).rejects.toThrow('bad del');
});

test('.values() makes an array of all keys for this prefix and optionally xforms them', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: x => x
    });
    mockDb.keys
        .mockReturnValueOnce(['otherNamespaceThing', 'test1foo1', 'test1foo2'])
        .mockReturnValueOnce(['test1foo1', 'test1foo2']);
    mockDb.get
        .mockReturnValueOnce('value1foo')
        .mockReturnValueOnce('value2foo')
        .mockReturnValueOnce('value1foo')
        .mockReturnValueOnce('value2foo');
    const valuesOut = await cfg.values();
    expect(valuesOut).toMatchObject(['value1foo', 'value2foo']);
    const valuesXformed = await cfg.values(x => x + 'x');
    expect(valuesXformed).toMatchObject(['value1foox', 'value2foox']);
});

test('.clear() calls underlying db', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: x => x
    });
    await cfg.clear();
    expect(mockDb.clear).toHaveBeenCalled();
});

test.skip('.clear() rejects with any errors passed from db', async () => {
    const cfg = new GlobalConfig({
        prefix: 'test1',
        key: x => x
    });
    mockDb.clear.mockImplementationOnce(cb => cb('bad clear'));
    return expect(cfg.clear()).rejects.toThrow('bad clear');
});
