const TargetableESModuleArray = require('../TargetableESModuleArray');
const SpliceSourceLoader = require('../../loaders/splice-source-loader');
const ESMCollectionLoader = require('../../loaders/export-esm-collection-loader');
const testWebpackLoader = require('../../../TestHelpers/testWebpackLoader');

test('builds a module which exports an array of its imports', async () => {
    const moduleArray = new TargetableESModuleArray(
        './module-array.js',
        () => {}
    );
    moduleArray.push('import first from "first"', '{ second } from "second";');
    moduleArray.push('{ third as second } from "third"');
    moduleArray.push('{ fourth as third } from "fourth"');
    moduleArray.unshift('* as first from "elsewhere"');
    moduleArray.unshift('{ second as silver } from "second"');
    const transform = moduleArray.flush();
    const result = await testWebpackLoader.runLoader(
        ESMCollectionLoader,
        'export default [];',
        {
            query: [transform[0].options]
        }
    );
    const errorsEmitted = result.context.getCalls('emitError');
    expect(errorsEmitted).toHaveLength(0);
    const withImports = await testWebpackLoader.runLoader(
        SpliceSourceLoader,
        result.output,
        {
            query: transform.slice(0).map(t => t.options)
        }
    );
    expect(withImports.output).toMatchSnapshot();
});
