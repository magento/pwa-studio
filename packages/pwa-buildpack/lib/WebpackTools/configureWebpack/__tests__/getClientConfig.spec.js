const path = require('path');
const getClientConfig = require('../getClientConfig');
const virtualWebpack = require('../../__tests__/__helpers__/virtualWebpack');
const fixture = require('../../../__tests__/__helpers__/getFixture');
const packagesFeaturing = jest.fn(() => []);
const baseOptionsWith = (fixtureName, overrides) => {
    const context = fixture(fixtureName);
    const paths = {
        src: path.resolve(context, './src/'),
        output: path.resolve(context, './dist/')
    };
    const baseOptions = {
        mode: 'production',
        context,
        esModuleRule: {
            test: /\.(mjs|js)$/,
            include: [paths.src],
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        envName: 'production',
                        rootMode: 'upward'
                    }
                }
            ]
        },
        fullEnv: {},
        packagesFeaturing,
        paths,
        vendor: []
    };
    return {
        ...baseOptions,
        ...overrides
    };
};
const processArgs = (...argv) => ({ argv });

test('allows all node_modules into vendor chunk unless specified', async () => {
    const config = await getClientConfig(
        baseOptionsWith('basic-project-1-page', {}),
        processArgs([])
    );
    expect(config).toHaveProperty(
        'optimization.splitChunks.cacheGroups.vendor.test',
        expect.any(RegExp)
    );
    const vendorTest = config.optimization.splitChunks.cacheGroups.vendor.test;
    expect('/node_modules/anything').toMatch(vendorTest);
});

test('allows only modules in vendor array into vendor chunk', async () => {
    const config = await getClientConfig(
        baseOptionsWith('basic-project-1-page', {
            vendor: ['react', 'apollo']
        }),
        processArgs()
    );
    const vendorTest = config.optimization.splitChunks.cacheGroups.vendor.test;
    expect('/node_modules/anything/index.js').not.toMatch(vendorTest);
    expect('/node_modules/react/index.js').toMatch(vendorTest);
    expect('/node_modules/apollo/subdir/lib/index.js').toMatch(vendorTest);
});

test('outputs client, runtime, manifest, upward, and chunks', async () => {
    const { output } = await virtualWebpack(
        await getClientConfig(
            baseOptionsWith('basic-project-1-page', {
                mode: 'development'
            }),
            processArgs()
        )
    );
    const files = Object.keys(output);
    expect(files).toEqual(
        expect.arrayContaining([
            'dist/client.js',
            'dist/upward.yml',
            'dist/asset-manifest.json'
        ])
    );
    expect(
        files.find(file => file.startsWith('dist/RootCmp_cms_page__default'))
    ).toBeTruthy();
});

// test('puts hash in filename in production mode', async () => {
