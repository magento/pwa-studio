const path = require('path');
const MagentoResolver = require('../MagentoResolver');

describe('legacy functionality', () => {
    test('static configure() produces a webpack resolver config with .ac.js extension if backend is Adobe Commerce', async () => {
        const extensions = [
            '.wasm',
            '.mjs',
            '.ac.js',
            '.ee.js',
            '.js',
            '.jsx',
            '.json',
            '.graphql'
        ];
        await expect(
            MagentoResolver.configure({
                paths: { root: 'fakeRoot' },
                isAC: true
            })
        ).resolves.toEqual({
            alias: {},
            modules: ['fakeRoot', 'node_modules'],
            mainFiles: ['index'],
            mainFields: ['esnext', 'es2015', 'module', 'browser', 'main'],
            extensions
        });
    });

    test('static configure() produces a webpack resolver config with .mos.js extension if backend is not Adobe Commerce', async () => {
        const extensions = [
            '.wasm',
            '.mjs',
            '.mos.js',
            '.ce.js',
            '.js',
            '.jsx',
            '.json',
            '.graphql'
        ];
        await expect(
            MagentoResolver.configure({
                paths: { root: 'fakeRoot' },
                isAC: false
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
test('creates a promisified resolver which respects provided config', async () => {
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
            // module folder 2
            [
                'depModule1BackwardCompatible',
                'node_modules/depModule1BackwardCompatible/index.js'
            ],
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

test('uses *.ac.js/*.ee.js or /*.mos.js/*.ce.js depending on isAC boolean', async () => {
    const mosResolver = new MagentoResolver({
        paths: {
            root: context
        },
        isAC: false
    });
    await expect(mosResolver.resolve('depModule1/someFeature')).resolves.toBe(
        path.resolve(context, 'node_modules/depModule1/someFeature.mos.js')
    );

    await expect(
        mosResolver.resolve('depModule1BackwardCompatible/someFeature')
    ).resolves.toBe(
        path.resolve(
            context,
            'node_modules/depModule1BackwardCompatible/someFeature.ce.js'
        )
    );

    const acResolver = new MagentoResolver({
        paths: {
            root: context
        },
        isAC: true
    });
    await expect(acResolver.resolve('depModule1/someFeature')).resolves.toBe(
        path.resolve(context, 'node_modules/depModule1/someFeature.ac.js')
    );

    await expect(
        acResolver.resolve('depModule1BackwardCompatible/someFeature')
    ).resolves.toBe(
        path.resolve(
            context,
            'node_modules/depModule1BackwardCompatible/someFeature.ee.js'
        )
    );
});
