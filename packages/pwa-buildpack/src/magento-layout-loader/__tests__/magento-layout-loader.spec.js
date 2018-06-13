const { join } = require('path');
const MemoryFS = require('memory-fs');
const { promisify: pify } = require('util');
const webpack = require('webpack');
const magentoLayoutLoaderPath = require.resolve('..');

const compile = async config => {
    const fs = new MemoryFS();
    const compiler = webpack(config);
    compiler.outputFileSystem = fs;

    return {
        fs,
        stats: await pify(compiler.run.bind(compiler))()
    };
};

const babelLoaderConfig = {
    loader: 'babel-loader',
    options: {
        plugins: ['transform-react-jsx'],
        babelrc: false
    }
};

test.skip('Warnings from babel plugin are mapped to the correct webpack module', async () => {
    const fixtureRoot = join(__dirname, '__fixtures__/only-entry');
    const config = {
        entry: join(fixtureRoot, 'index.js'),
        output: {
            path: join(fixtureRoot, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.js/,
                    use: [
                        {
                            loader: magentoLayoutLoaderPath,
                            options: { config: {} }
                        },
                        babelLoaderConfig
                    ]
                }
            ]
        }
    };

    const { compilation } = (await compile(config)).stats;
    const [entryModule] = compilation.entries;
    const [warning] = entryModule.warnings;
    expect(warning.message).toContain(
        '"data-mid" found on a Composite Component'
    );
});
