const path = require('path');
const MagentoResolver = require('../MagentoResolver');

describe('legacy functionality', () => {
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
            MagentoResolver.configure({
                paths: { root: 'fakeRoot' },
                isEE: true
            })
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
            MagentoResolver.configure({
                paths: { root: 'fakeRoot' },
                isEE: false
            })
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
        ).rejects.toThrow('paths.root');
    });
});

const context = path.resolve(__dirname, './__fixtures__/resolverContext');
test('creates a promisifed resolver which respects provided config', async () => {
    const resolver = new MagentoResolver({
        paths: {
            root: context
        }
    });

    await Promise.all(
        [
            // root-relative
            ['.', 'localModule2.js'],
            // extension precedence
            ['localModule1', './localModule1/index.wasm'],
            // module folder
            ['depModule1', 'node_modules/depModule1/index.js'],
            // recursively resolve parent folder deps
            ['jest', require.resolve('jest')]
        ].map(([request, expected]) =>
            expect(resolver.resolve(request)).resolves.toBe(
                path.resolve(context, expected)
            )
        )
    );

    await expect(resolver.resolve('./missing')).rejects.toThrowError();
});

test('rejects if it has been configured weird', async () => {
    const resolver = new MagentoResolver({
        paths: {
            root: context
        }
    });

    resolver._resolver = {};

    await expect(resolver.resolve('./bogus')).rejects.toThrowError();
});

test('uses *.ee.js or *.ce.js depending on isEE boolean', async () => {
    const ceResolver = new MagentoResolver({
        paths: {
            root: context
        },
        isEE: false
    });
    await expect(ceResolver.resolve('depModule1/someFeature')).resolves.toBe(
        path.resolve(context, 'node_modules/depModule1/someFeature.ce.js')
    );

    const eeResolver = new MagentoResolver({
        paths: {
            root: context
        },
        isEE: true
    });
    await expect(eeResolver.resolve('depModule1/someFeature')).resolves.toBe(
        path.resolve(context, 'node_modules/depModule1/someFeature.ee.js')
    );
});
