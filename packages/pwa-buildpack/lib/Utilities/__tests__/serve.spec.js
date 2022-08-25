jest.mock('fs');
const { existsSync, readFileSync } = require('fs');

const { createUpwardServer } = require('@magento/upward-js');
const compression = require('compression');
const serve = require('../serve');
const addImgOptMiddleware = require('../addImgOptMiddleware');
const prettyLogger = require('../../util/pretty-logger');
const loadEnvironment = require('../../Utilities/loadEnvironment');
const configureHost = require('../configureHost');

jest.mock('path', () => ({
    ...jest.requireActual('path'),
    join: jest.fn().mockReturnValue('.')
}));

jest.mock('../../Utilities/loadEnvironment', () => jest.fn());

jest.mock('compression', () =>
    jest
        .fn()
        .mockName('Compression Middleware')
        .mockReturnValue('Compressed Middleware')
);

jest.mock('../addImgOptMiddleware', () =>
    jest.fn().mockName('Add Img Opt Middleware')
);

jest.mock('../configureHost', () =>
    jest
        .fn()
        .mockName('Configure Host')
        .mockResolvedValue({
            hostname: 'Sample Hostname',
            ports: {
                staging: 1234
            },
            ssl: 'Sample SSL String'
        })
);

jest.mock('@magento/upward-js', () => ({
    createUpwardServer: jest
        .fn()
        .mockName('Create Upward Server')
        .mockResolvedValue('Server Object')
}));

let logs = {
    info: [],
    warn: [],
    success: [],
    error: []
};

jest.mock('../../util/pretty-logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
}));

const getStagingServerConfig = jest.fn().mockReturnValue({
    port: 1234
});
const getUpwardJsConfig = jest.fn().mockReturnValue({});
const getImageOptConfig = jest.fn().mockReturnValue({});
const getImageServiceConfig = jest.fn().mockReturnValue({});
const getCustomOriginConfig = jest.fn().mockReturnValue({
    enabled: false
});
const getcustomHttpsConfig = jest.fn().mockReturnValue({});

const getSectionData = sectionName => {
    if (sectionName === 'stagingServer') {
        return getStagingServerConfig();
    } else if (sectionName === 'upwardJs') {
        return getUpwardJsConfig();
    } else if (sectionName === 'imageOptimizing') {
        return getImageOptConfig();
    } else if (sectionName === 'imageService') {
        return getImageServiceConfig();
    } else if (sectionName === 'customOrigin') {
        return getCustomOriginConfig();
    } else if (sectionName === 'customHttps') {
        return getcustomHttpsConfig();
    } else {
        return {};
    }
};

beforeAll(() => {
    loadEnvironment.mockResolvedValue({
        error: null,
        section: getSectionData,
        isProd: true
    });
});

beforeEach(() => {
    process.env = {
        ENABLE_EXPRESS_SERVER_COMPRESSION: 'false',
        PORT: '1234'
    };

    logs = {
        info: [],
        warn: [],
        success: [],
        error: []
    };

    prettyLogger.info.mockImplementation((...args) => logs.info.push(...args));
    prettyLogger.warn.mockImplementation((...args) => logs.warn.push(...args));
    prettyLogger.success.mockImplementation((...args) =>
        logs.success.push(...args)
    );
    prettyLogger.error.mockImplementation((...args) =>
        logs.error.push(...args)
    );
});

afterEach(() => {
    existsSync.mockReset();
    readFileSync.mockReset();
});

test('should create upward server', async () => {
    const server = await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls).toMatchSnapshot();
    expect(server).toMatchSnapshot();
    expect(logs).toMatchSnapshot();
});

test('should add compression middleware if ENABLE_EXPRESS_SERVER_COMPRESSION is true', async () => {
    process.env.ENABLE_EXPRESS_SERVER_COMPRESSION = 'true';
    const use = jest.fn();
    createUpwardServer.mockImplementationOnce(serverOptions => {
        const { before } = serverOptions;
        const app = {
            use
        };
        before(app);
    });

    await serve('pwa-buildpack');

    expect(compression).toHaveBeenCalled();
    expect(use).toHaveBeenCalledWith(compression());
    expect(logs).toMatchSnapshot();
});

test('should not add compression middleware if ENABLE_EXPRESS_SERVER_COMPRESSION is false', async () => {
    process.env.ENABLE_EXPRESS_SERVER_COMPRESSION = 'false';
    const use = jest.fn();
    createUpwardServer.mockImplementationOnce(serverOptions => {
        const { before } = serverOptions;
        const app = {
            use
        };
        before(app);
    });

    await serve('pwa-buildpack');

    expect(compression).not.toHaveBeenCalled();
    expect(use).not.toHaveBeenCalledWith(compression());
    expect(logs).toMatchSnapshot();
});

test('should add the Image Opt middleware', async () => {
    createUpwardServer.mockImplementationOnce(serverOptions => {
        const { before } = serverOptions;
        const app = {};
        before(app);
    });

    await serve('pwa-buildpack');

    expect(addImgOptMiddleware).toHaveBeenCalled();
    expect(addImgOptMiddleware.mock.calls).toMatchSnapshot();
    expect(logs).toMatchSnapshot();
});

test('should throw error if unable to load env', async () => {
    loadEnvironment.mockResolvedValueOnce({
        error: 'unable to load env',
        section: getSectionData,
        isProd: false
    });

    try {
        await serve('pwa-buildpack');
    } catch (error) {
        expect(error).toMatchSnapshot();
    }

    expect(logs).toMatchSnapshot();
});

test('should use env.PORT if provided', async () => {
    process.env.PORT = '7899';

    await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls[0][0].port).toBe('7899');
    expect(logs).toMatchSnapshot();
});

test('should use staging server port if env.PORT is null', async () => {
    process.env.PORT = 'null';
    getStagingServerConfig.mockReturnValueOnce({
        port: '5678'
    });

    await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls[0][0].port).toBe('5678');
    expect(logs).toMatchSnapshot();
});

test('should use staging server port if env.PORT is not defined', async () => {
    process.env.PORT = 'undefined';
    getStagingServerConfig.mockReturnValueOnce({
        port: '5678'
    });

    await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls[0][0].port).toBe('5678');
    expect(logs).toMatchSnapshot();
});

test('should use staging server port if env.PORT is undefined', async () => {
    process.env.PORT = undefined;
    getStagingServerConfig.mockReturnValueOnce({
        port: '5678'
    });

    await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls[0][0].port).toBe('5678');
    expect(logs).toMatchSnapshot();
});

test('should use port 0 if both env.PORT and staging config port are falsy', async () => {
    process.env.PORT = 'null';
    getStagingServerConfig.mockReturnValueOnce({
        port: null
    });

    await serve('pwa-buildpack');

    expect(createUpwardServer.mock.calls[0][0].port).toBe(0);
    expect(logs).toMatchSnapshot();
});

test('should use configureHost config if custom origin is enabled', async () => {
    process.env.PORT = '7899';
    getCustomOriginConfig.mockReturnValueOnce({
        enabled: true
    });
    loadEnvironment.mockResolvedValueOnce({
        error: null,
        section: getSectionData,
        isProd: false
    });

    await serve('pwa-buildpack');

    expect(configureHost.mock.calls).toMatchSnapshot();
    expect(createUpwardServer.mock.calls[0][0].port).toBe('7899');
    expect(createUpwardServer.mock.calls[0][0].host).toBe('Sample Hostname');
    expect(createUpwardServer.mock.calls[0][0].https).toBe('Sample SSL String');
    expect(logs).toMatchSnapshot();
});

test('should log error if configureHost throws error', async () => {
    process.env.PORT = '7899';
    getCustomOriginConfig.mockReturnValueOnce({
        enabled: true
    });
    loadEnvironment.mockResolvedValueOnce({
        error: null,
        section: getSectionData,
        isProd: false
    });
    configureHost.mockRejectedValueOnce({
        message: 'unable to configure host'
    });

    await serve('pwa-buildpack');

    expect(logs).toMatchSnapshot();
});

test('should use custom https if key and cert paths provided from the env', async () => {
    const key = 'path/to/key';
    const cert = 'path/to/cert';
    getcustomHttpsConfig.mockReturnValueOnce({
        key,
        cert
    });
    // mock that files exist
    existsSync.mockReturnValue(true);
    readFileSync
        .mockReturnValueOnce('key_for_https')
        .mockReturnValueOnce('cert_for_https');
    await serve('pwa-buildpack');

    // check if files exist
    expect(existsSync).toBeCalledTimes(2);
    expect(existsSync.mock.calls[0][0]).toBe(key);
    expect(existsSync.mock.calls[1][0]).toBe(cert);

    // check if both files are also read
    expect(readFileSync).toBeCalledTimes(2);
    expect(readFileSync.mock.calls[0]).toEqual([key, 'utf8']);
    expect(readFileSync.mock.calls[1]).toEqual([cert, 'utf8']);

    // upward server should now have custom key and cert
    expect(createUpwardServer.mock.calls[0][0].https).toEqual({
        key: 'key_for_https',
        cert: 'cert_for_https'
    });
    // logs info that creating HTTPS server with custom cert and key
    expect(logs).toMatchSnapshot();
});

test('should throw a warning if key and cert paths are provided but key doesnt exist', async () => {
    const key = 'path/to/key';
    const cert = 'path/to/cert';
    getcustomHttpsConfig.mockReturnValueOnce({
        key,
        cert
    });
    existsSync.mockReturnValueOnce(false);

    await serve('pwa-buildpack');

    // will be called only once and fail on the if statement
    expect(existsSync).toBeCalledTimes(1);

    // should not try to read files
    expect(readFileSync).not.toBeCalled();
    expect(logs.warn.length).toBe(1);
    expect(logs).toMatchSnapshot();
    expect(createUpwardServer.mock.calls[0][0].https).toBe(undefined);
});

test('should throw a warning if key and cert paths are provided but cert doesnt exist', async () => {
    const key = 'path/to/key';
    const cert = 'path/to/cert';
    getcustomHttpsConfig.mockReturnValueOnce({
        key,
        cert
    });
    existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await serve('pwa-buildpack');

    // will be called twice and fail on the if statement
    expect(existsSync).toBeCalledTimes(2);

    // should not try to read files
    expect(readFileSync).not.toBeCalled();
    expect(logs.warn.length).toBe(1);
    expect(logs).toMatchSnapshot();
    expect(createUpwardServer.mock.calls[0][0].https).toBe(undefined);
});

test('should not try to read custom key and cert if one of them is missing', async () => {
    const key = 'path/to/key';
    getcustomHttpsConfig.mockReturnValueOnce({
        key,
        cert: undefined
    });

    await serve('pwa-buildpack');

    expect(existsSync).not.toBeCalled();
    expect(readFileSync).not.toBeCalled();
    expect(createUpwardServer.mock.calls[0][0].https).toBe(undefined);
});
