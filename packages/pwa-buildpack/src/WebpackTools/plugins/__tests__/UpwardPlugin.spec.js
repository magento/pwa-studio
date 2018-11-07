jest.mock('node-fetch');
jest.mock('@magento/upward-js');
const upward = require('@magento/upward-js');
const fetch = require('node-fetch');
const UpwardPlugin = require('../UpwardPlugin');

test('creates a devServer.after function if it does not exist', () => {
    const devServer = {};
    const app = {
        use: jest.fn()
    };
    new UpwardPlugin(devServer, process.env);
    expect(devServer.after).toBeInstanceOf(Function);
    devServer.after(app);
    expect(app.use).toHaveBeenCalledWith(expect.any(Function));
});

test('composes with an existing devServer.after function', () => {
    const after = jest.fn();
    const devServer = { after };
    const app = {
        use: jest.fn()
    };
    new UpwardPlugin(devServer, process.env);
    expect(devServer.after).not.toBe(after);
    devServer.after(app);
    expect(app.use).toHaveBeenCalledWith(expect.any(Function));
    expect(after).toHaveBeenCalledWith(app);
});

test('applies to a Webpack compiler and resolves any existing devServer requests', async () => {
    const devServer = {};
    const compiler = {};
    const req = {},
        res = {},
        next = {};
    const app = {
        use: jest.fn()
    };
    const upwardHandler = jest.fn();

    upward.middleware.mockResolvedValueOnce(upwardHandler);

    const noRequestsWaiting = new UpwardPlugin({}, process.env);
    noRequestsWaiting.apply(compiler);
    expect(noRequestsWaiting.compiler).toBe(compiler);

    const hasRequestsWaiting = new UpwardPlugin(
        devServer,
        process.env,
        'path/to/upward'
    );
    devServer.after(app);
    const handler = app.use.mock.calls[0][0];

    handler(req, res, next);
    expect(upward.IOAdapter.default).not.toHaveBeenCalled();
    expect(upward.middleware).not.toHaveBeenCalled();
    expect(hasRequestsWaiting.middlewarePromise).toBeInstanceOf(Promise);

    hasRequestsWaiting.apply(compiler);
    await hasRequestsWaiting.middlewarePromise;

    expect(upward.IOAdapter.default).toHaveBeenCalledWith('path/to/upward');
    expect(upward.middleware).toHaveBeenCalledWith(
        'path/to/upward',
        process.env,
        expect.objectContaining({
            readFile: expect.any(Function),
            networkFetch: expect.any(Function)
        })
    );
    expect(upwardHandler).toHaveBeenCalledWith(req, res, next);
});

test('shares compiler promise', async () => {
    const devServer = {};
    const compiler = {};
    const upwardHandler = jest.fn();

    upward.middleware.mockResolvedValueOnce(upwardHandler);
    const plugin = new UpwardPlugin(devServer, process.env, 'path/to/upward');

    const promises = [plugin.getCompiler(), plugin.getCompiler()];

    plugin.apply(compiler);
    const [c1, c2] = await Promise.all(promises);

    expect(c1).toBe(c2);
    expect(c2).toBe(compiler);
});

test('shares middleware promise so as not to create multiple middlewares', async () => {
    const devServer = {};
    const compiler = {};
    const req = {},
        res = {},
        next = {};
    const app = {
        use: jest.fn()
    };
    const upwardHandler = jest.fn();

    upward.middleware.mockResolvedValueOnce(upwardHandler);
    const plugin = new UpwardPlugin(devServer, process.env, 'path/to/upward');
    devServer.after(app);
    const handler = app.use.mock.calls[0][0];

    handler(req, res, next);
    handler('some', 'other', 'stuff');
    plugin.apply(compiler);

    await plugin.middlewarePromise;

    expect(upward.middleware).toHaveBeenCalledTimes(1);
});

test('supplies a dev-mode IOAdapter with webpack fs integration', async () => {
    const devServer = {};
    const compiler = {
        options: {
            output: {
                path: '/'
            }
        },
        outputFileSystem: {
            readFileSync: jest.fn()
        },
        inputFileSystem: {
            readFileSync: jest.fn()
        }
    };
    const defaultIO = {
        readFile: jest.fn()
    };
    const app = {
        use: jest.fn()
    };

    upward.middleware.mockResolvedValueOnce(() => {});
    upward.IOAdapter.default.mockReturnValueOnce(defaultIO);

    const plugin = new UpwardPlugin(devServer, process.env);
    plugin.apply(compiler);
    devServer.after(app);
    const handler = app.use.mock.calls[0][0];
    handler();
    await plugin.middlewarePromise;

    const io = upward.middleware.mock.calls[0][2];

    compiler.outputFileSystem.readFileSync.mockImplementationOnce(() => {
        return 'from output file system';
    });
    const fromOutputFileSystem = await io.readFile('aFile', 'binary');
    expect(fromOutputFileSystem).toBe('from output file system');
    expect(compiler.outputFileSystem.readFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/aFile$/),
        'binary'
    );

    compiler.outputFileSystem.readFileSync.mockImplementationOnce(() => {
        throw new Error('ENOENT');
    });
    defaultIO.readFile.mockResolvedValueOnce('from default filesystem');
    const fromDefaultFileSystem = await io.readFile('bFile');
    expect(fromDefaultFileSystem).toBe('from default filesystem');
    expect(compiler.outputFileSystem.readFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/bFile$/),
        undefined
    );
    expect(defaultIO.readFile).toHaveBeenCalledWith(
        expect.stringMatching(/bFile$/),
        undefined
    );

    compiler.outputFileSystem.readFileSync.mockImplementationOnce(() => {
        throw new Error('ENOENT');
    });
    defaultIO.readFile.mockImplementationOnce(() =>
        Promise.reject(new Error('ENOENT'))
    );
    compiler.inputFileSystem.readFileSync.mockImplementationOnce(
        () => 'from input file system'
    );
    const fromInputFileSystem = await io.readFile('cFile');
    expect(fromInputFileSystem).toBe('from input file system');
    expect(compiler.outputFileSystem.readFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/cFile$/),
        undefined
    );
    expect(defaultIO.readFile).toHaveBeenCalledWith(
        expect.stringMatching(/cFile$/),
        undefined
    );
    expect(compiler.inputFileSystem.readFileSync).toHaveBeenCalledWith(
        expect.stringMatching(/cFile$/),
        undefined
    );
});

test('dev-mode IOAdapter uses fetch', async () => {
    const devServer = {};
    const app = {
        use: jest.fn()
    };

    upward.middleware.mockResolvedValueOnce(() => {});

    const plugin = new UpwardPlugin(devServer, process.env);
    plugin.apply({});
    devServer.after(app);
    const handler = app.use.mock.calls[0][0];
    handler();
    await plugin.middlewarePromise;

    const io = upward.middleware.mock.calls[0][2];

    io.networkFetch('https://example.com', { method: 'POST' });

    expect(fetch).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({
            method: 'POST',
            agent: expect.anything()
        })
    );
});

test('dev-mode IOAdapter can fetch unsecure URLs', async () => {
    const devServer = {};
    const app = {
        use: jest.fn()
    };

    upward.middleware.mockResolvedValueOnce(() => {});

    const plugin = new UpwardPlugin(devServer, process.env);
    plugin.apply({});
    devServer.after(app);
    const handler = app.use.mock.calls[0][0];
    handler();
    await plugin.middlewarePromise;

    const io = upward.middleware.mock.calls[0][2];

    io.networkFetch('http://example.com', { method: 'POST' });

    expect(fetch).toHaveBeenCalledWith(
        'http://example.com',
        expect.objectContaining({
            method: 'POST'
        })
    );
    expect(fetch.mock.calls[0][1]).not.toHaveProperty('agent');
});
