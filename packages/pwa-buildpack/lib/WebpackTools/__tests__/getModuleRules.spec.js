const getModuleRules = require('../configureWebpack/getModuleRules');

describe('css', async () => {
    const helper = {
        mode: 'development',
        paths: {
            src: 'unit_test'
        },
        hasFlag: () => [],
        babelRootMode: 'unit_test',
        transformRequests: {
            babel: {},
            source: {}
        }
    };
    const isStyleLoaderRule = rule => {
        return rule.loader === 'style-loader';
    };
    const injectTypeIs = value => {
        return rule => rule.options.injectType === value;
    };
    const injectTypeIsStyleTag = injectTypeIs('styleTag');
    const injectTypeIsSingletonStyleTag = injectTypeIs('singletonStyleTag');

    test('style loader inject type is "styleTag" in development', async () => {
        // Arrange.

        // Act.
        const rules = await getModuleRules(helper);

        // Assert.
        // Promise.all returns an array of result objects.
        const cssRule = rules[2];

        const { oneOf } = cssRule;
        oneOf.forEach(rule => {
            const { use } = rule;
            const allInjectTypesAreCorrect = use
                .filter(isStyleLoaderRule)
                .every(injectTypeIsStyleTag);

            expect(allInjectTypesAreCorrect).toBe(true);
        });
    });

    test('style loader inject type is "singletonStyleTag" not in development', async () => {
        // Arrange.
        const myHelper = {
            ...helper,
            mode: 'production'
        };

        // Act.
        const rules = await getModuleRules(myHelper);

        // Assert.
        // Promise.all returns an array of result objects.
        const cssRule = rules[2];

        const { oneOf } = cssRule;
        oneOf.forEach(rule => {
            const { use } = rule;
            const allInjectTypesAreCorrect = use
                .filter(isStyleLoaderRule)
                .every(injectTypeIsSingletonStyleTag);

            expect(allInjectTypesAreCorrect).toBe(true);
        });
    });
});
