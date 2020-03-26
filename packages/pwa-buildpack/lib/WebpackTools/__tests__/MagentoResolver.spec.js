const MagentoResolver = require('../MagentoResolver');

test('static configure() produces a webpack resolver config with .ee.js extension if backend is enterprise edition', async () => {
    const extensions = [
        '.wasm',
        '.mjs',
        '.ee.js',
        '.js',
        '.jsx',
        '.json',
        '.graphql'
    ];
    await expect(
        MagentoResolver.configure({ paths: { root: 'fakeRoot' }, isEE: true })
    ).resolves.toEqual({
        alias: {},
        modules: ['fakeRoot', 'node_modules'],
        mainFiles: ['index'],
        mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
        extensions
    });
});

test('static configure() produces a webpack resolver config with .ce.js extension if backend is not enterprise edition', async () => {
    const extensions = [
        '.wasm',
        '.mjs',
        '.ce.js',
        '.js',
        '.jsx',
        '.json',
        '.graphql'
    ];
    await expect(
        MagentoResolver.configure({ paths: { root: 'fakeRoot' }, isEE: false })
    ).resolves.toEqual({
        alias: {},
        modules: ['fakeRoot', 'node_modules'],
        mainFiles: ['index'],
        mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
        extensions
    });
});

test('static configure() throws if required paths are missing', async () => {
    await expect(
        MagentoResolver.configure({ paths: { root: false } })
    ).rejects.toThrow('paths.root must be of type string');
});
