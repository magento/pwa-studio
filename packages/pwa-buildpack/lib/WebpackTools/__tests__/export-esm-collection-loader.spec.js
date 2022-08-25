const ESMCollectionLoader = require('../loaders/export-esm-collection-loader');
const { runLoader } = require('../../TestHelpers/testWebpackLoader');

test('exports arrays of modules', async () => {
    expect(
        (await runLoader(ESMCollectionLoader, 'export default []', {
            query: [
                {
                    bindings: [
                        'import indexZero from "index-zero"',
                        'import { indexOne } from "./index-one"'
                    ],
                    type: 'array'
                }
            ]
        })).output
    ).toMatchSnapshot();
});

test('exports object maps of modules', async () => {
    expect(
        (await runLoader(ESMCollectionLoader, 'export default {}', {
            query: [
                {
                    bindings: [
                        'import propOne from "prop-one"',
                        'import { propTwo } from "./prop-two"',
                        '{ propTwo as propThree } from "./prop-three"'
                    ],
                    type: 'object'
                }
            ]
        })).output
    ).toMatchSnapshot();
});

test('fails informatively if template module does not export the right kind of empty collection', async () => {
    const { context, output } = await runLoader(
        ESMCollectionLoader,
        'export default {}',
        {
            query: [
                {
                    bindings: [
                        'import indexZero from "index-zero"',
                        'import { indexOne } from "./index-one"'
                    ],
                    type: 'array'
                }
            ]
        }
    );
    expect(context.getCalls('emitError')).toMatchSnapshot();
    expect(output).toBe('export default {}');
});

test('emits errors sent by targetable to loader', async () => {
    const { context } = await runLoader(
        ESMCollectionLoader,
        'export default []',
        {
            query: [
                {
                    type: 'array',
                    bindings: [],
                    errors: [
                        'Passed from targetable!',
                        'passed from targetable as well'
                    ]
                }
            ]
        }
    );
    expect(context.getCalls('emitError')).toMatchSnapshot();
});

test('warns if nothing was added', async () => {
    const { context, output } = await runLoader(
        ESMCollectionLoader,
        'export default []',
        {
            query: [
                {
                    type: 'array',
                    bindings: []
                }
            ]
        }
    );
    expect(context.getCalls('emitWarning')).toMatchSnapshot();
    expect(output).toBe('export default []');
});
