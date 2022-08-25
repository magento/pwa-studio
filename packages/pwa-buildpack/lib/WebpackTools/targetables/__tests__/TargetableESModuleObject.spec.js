const TargetableESModuleObject = require('../TargetableESModuleObject');
const SpliceSourceLoader = require('../../loaders/splice-source-loader');
const ESMCollectionLoader = require('../../loaders/export-esm-collection-loader');
const testWebpackLoader = require('../../../TestHelpers/testWebpackLoader');

test('builds a module which exports an object mapping of its imports', async () => {
    const moduleObject = new TargetableESModuleObject(
        './module-object.js',
        () => {}
    );
    moduleObject.add('import first from "first"', '{ second } from "second";');
    moduleObject.add('{ third as second } from "third"');
    moduleObject.add('{ fourth as third } from "fourth"');
    moduleObject.add('* as first from "elsewhere"');
    moduleObject.add('{ second as silver } from "second"');
    const transform = moduleObject.flush();
    const result = await testWebpackLoader.runLoader(
        ESMCollectionLoader,
        '/** this-un exports an object with mappings */\nexport default {};',
        {
            query: [transform[0].options]
        }
    );
    expect(result.context.getCalls('emitError')).toMatchSnapshot();
    const withImports = await testWebpackLoader.runLoader(
        SpliceSourceLoader,
        result.output,
        {
            query: transform.slice(0).map(t => t.options)
        }
    );
    expect(withImports.output).toMatchSnapshot();
});
