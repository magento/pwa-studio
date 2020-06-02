/**
 * Centralized Jest configuration file for all projects in repo.
 * This file uses Jest `projects` configuration and a couple of undocumented
 * hacks to get around some known issues in Jest configuration and coverage of
 * monorepos.
 */
const path = require('path');

/**
 * `configureProject()` makes a config object for use in the `projects` array.
 *
 * Each config object may use several root-relative paths to files in its
 * package folder. Instead of repetitive strings, like:
 *
 *     {
 *         name: 'peregrine',
 *         displayName: 'Peregrine',
 *         testMatch: '<rootDir>/packages/peregrine/**\/__tests__/*.(test|spec).js'
 *         setupFiles: [
 *             '<rootDir>/packages/peregrine/scripts/shim.js'
 *             '<rootDir>/packages/peregrine/scripts/fetch-mock.js'
 *         ]
 *     }
 *
 * Provide a convenience function via a callback, so the caller can provide
 * a configuration function which receives a path builder.
 *
 *      configureProject('peregrine', 'Peregrine', inPackage => ({
 *          setupFiles: [
 *              inPackage('scripts/shim.js'),
 *              inPackage('scripts/fetch-mock.js')
 *          ],
 *      }))
 *
 */

// Reusable glob string for building `testMatch` patterns.
// All testable code in packages lives at either 'src' for code that must
// transpile, or 'lib' for code that doesn't have to.
const testGlob = '/**/{src,lib,_buildpack}/**/__tests__/*.(test|spec).js';

// Reusable test configuration for Venia UI and storefront packages.
const testReactComponents = inPackage => ({
    // Expose jsdom to tests.
    browser: true,
    moduleNameMapper: {
        // Mock binary files to avoid excess RAM usage.
        '\\.(jpg|jpeg|png)$':
            '<rootDir>/packages/venia-ui/__mocks__/fileMock.js',
        // CSS module classes are dynamically generated, but that makes
        // it hard to test React components using DOM classnames.
        // This mapping forces CSS Modules to return literal identies,
        // so e.g. `classes.root` is always `"root"`.
        '\\.css$': 'identity-obj-proxy',
        '\\.svg$': 'identity-obj-proxy'
    },
    moduleFileExtensions: ['ee.js', 'ce.js', 'js', 'json', 'jsx', 'node'],
    // Reproduce the Webpack resolution config that lets Venia import
    // from `src` instead of with relative paths:
    modulePaths: [
        inPackage(),
        inPackage('node_modules'),
        '<rootDir>/node_modules'
    ],
    // Set up Enzyme React 16 adapter for testing React components
    setupFilesAfterEnv: [
        path.join('<rootDir>', 'scripts', 'jest-enzyme-setup.js')
    ],
    // Give jsdom a real URL for router testing.
    testURL: 'http://localhost/',
    transform: {
        // Reproduce the Webpack `graphql-tag/loader` that lets Venia
        // import `.graphql` files into JS.
        '\\.(gql|graphql)$': 'jest-transform-graphql',
        // Use the default babel-jest for everything else.
        '\\.(js|css)$': 'babel-jest'
    },
    // Normally babel-jest ignores node_modules and only transpiles the current
    // package's source. The below setting forces babel-jest to transpile
    // @magento namespaced packages like Peregrine and Venia UI as well, when
    // it's testing Venia. That way, changes in sibling packages don't require a
    // full compile.
    transformIgnorePatterns: [
        'node_modules/(?!@magento|jarallax|video-worker/)'
    ],
    globals: {
        UNION_AND_INTERFACE_TYPES: {
            __schema: {
                types: [
                    {
                        kind: 'INTERFACE',
                        name: 'ProductInterface',
                        possibleTypes: [
                            { name: 'VirtualProduct' },
                            { name: 'SimpleProduct' },
                            { name: 'DownloadableProduct' },
                            { name: 'BundleProduct' },
                            { name: 'GiftCardProduct' },
                            { name: 'GroupedProduct' },
                            { name: 'ConfigurableProduct' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'MediaGalleryInterface',
                        possibleTypes: [
                            { name: 'ProductImage' },
                            { name: 'ProductVideo' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'ProductLinksInterface',
                        possibleTypes: [{ name: 'ProductLinks' }]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'CategoryInterface',
                        possibleTypes: [{ name: 'CategoryTree' }]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'LayerFilterItemInterface',
                        possibleTypes: [
                            { name: 'LayerFilterItem' },
                            { name: 'SwatchLayerFilterItem' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'PhysicalProductInterface',
                        possibleTypes: [
                            { name: 'SimpleProduct' },
                            { name: 'BundleProduct' },
                            { name: 'GiftCardProduct' },
                            { name: 'GroupedProduct' },
                            { name: 'ConfigurableProduct' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'CustomizableOptionInterface',
                        possibleTypes: [
                            { name: 'CustomizableAreaOption' },
                            { name: 'CustomizableDateOption' },
                            { name: 'CustomizableDropDownOption' },
                            { name: 'CustomizableMultipleOption' },
                            { name: 'CustomizableFieldOption' },
                            { name: 'CustomizableFileOption' },
                            { name: 'CustomizableRadioOption' },
                            { name: 'CustomizableCheckboxOption' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'CustomizableProductInterface',
                        possibleTypes: [
                            { name: 'VirtualProduct' },
                            { name: 'SimpleProduct' },
                            { name: 'DownloadableProduct' },
                            { name: 'BundleProduct' },
                            { name: 'GiftCardProduct' },
                            { name: 'ConfigurableProduct' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'CartItemInterface',
                        possibleTypes: [
                            { name: 'SimpleCartItem' },
                            { name: 'VirtualCartItem' },
                            { name: 'ConfigurableCartItem' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'CartAddressInterface',
                        possibleTypes: [
                            { name: 'ShippingCartAddress' },
                            { name: 'BillingCartAddress' }
                        ]
                    },
                    {
                        kind: 'INTERFACE',
                        name: 'SwatchLayerFilterItemInterface',
                        possibleTypes: [{ name: 'SwatchLayerFilterItem' }]
                    }
                ]
            }
        },
        STORE_NAME: 'Venia'
    }
});

const configureProject = (dir, displayName, cb) => {
    // Add defaults that every project config must include.
    // Jest should properly merge some of these in from the root configuration,
    // but it doesn't: https://github.com/facebook/jest/issues/7268

    // Pass a function which builds paths inside this project to a callback
    // which returns any additional properties.
    const config = cb(path.join.bind(path, '<rootDir>', 'packages', dir));

    // Merge and dedupe some crucial arrays.
    const overrides = {
        setupFilesAfterEnv: [
            '<rootDir>/scripts/jest-magic-console.js',
            '<rootDir>/scripts/jest-catch-rejections.js'
        ]
    };
    if (config.setupFilesAfterEnv) {
        overrides.setupFilesAfterEnv = [
            ...new Set([
                ...overrides.setupFilesAfterEnv,
                ...config.setupFilesAfterEnv
            ])
        ];
    }

    if (config.testEnvironment === 'node') {
        overrides.testEnvironment = '<rootDir>/scripts/jest-env-node.js';
    } else if (config.testEnvironment === 'jsdom' || !config.testEnvironment) {
        // use our default jsdom instead of the default jsdom
        overrides.testEnvironment = '<rootDir>/scripts/jest-env-jsdom.js';
    }

    return Object.assign(
        {
            // Set all projects to use the repo root as `rootDir`,
            // to work around https://github.com/facebook/jest/issues/7359
            rootDir: __dirname,
            // Use the dir as a unique "name" property to each config, to force
            // Jest to use different `jest-resolve` instances for each project.
            // This is an undocumented workaround:
            // https://github.com/facebook/jest/issues/6887#issuecomment-417170450
            name: dir,
            // Displays in the CLI.
            displayName,
            // All projects run in the context of the repo root, so each project
            // must specify manually that it only runs tests in its package
            // directory.
            testMatch: [path.join('<rootDir>', 'packages', dir, testGlob)],
            // All project must clear mocks before every test,
            clearMocks: true
        },
        config,
        overrides
    );
};

const jestConfig = {
    projects: [
        configureProject('babel-preset-peregrine', 'Babel Preset', () => ({
            testEnvironment: 'node'
        })),
        configureProject('pagebuilder', 'Pagebuilder', testReactComponents),
        configureProject('peregrine', 'Peregrine', inPackage => ({
            // Expose jsdom to tests.
            browser: true,
            setupFiles: [
                // Shim DOM properties not supported by jsdom
                inPackage('scripts/shim.js'),
                // Always mock `fetch` instead of doing real network calls
                inPackage('scripts/fetch-mock.js')
            ],
            // Set up Enzyme React 16 adapter for testing React components
            setupFilesAfterEnv: [
                path.join('<rootDir>', 'scripts', 'jest-enzyme-setup.js')
            ],
            // Give jsdom a real URL for router testing.
            testURL: 'http://localhost/'
        })),
        configureProject('pwa-buildpack', 'Buildpack', inPackage => ({
            testEnvironment: 'node',
            modulePaths: [
                inPackage('lib/Utilities/__tests__/__fixtures__/modules')
            ],
            setupFiles: [inPackage('scripts/fetch-mock.js')]
        })),
        configureProject('upward-js', 'Upward JS', () => ({
            testEnvironment: 'node'
        })),
        configureProject('venia-concept', 'Venia Storefront', inPackage =>
            testReactComponents(inPackage)
        ),
        configureProject('venia-ui', 'Venia UI', inPackage => ({
            ...testReactComponents(inPackage),
            setupFiles: [
                path.join('<rootDir>', 'scripts', 'jest-backend-setup.js')
            ]
        })),
        // Test any root CI scripts as well, to ensure stable CI behavior.
        configureProject('scripts', 'CI Scripts', () => ({
            testEnvironment: 'node',
            testMatch: [`<rootDir>/scripts/${testGlob}`]
        })),
        // Test the graphql-cli plugin
        configureProject(
            'graphql-cli-validate-magento-pwa-queries',
            'GraphQL CLI Plugin',
            () => ({
                testEnvironment: 'node',
                moduleNameMapper: {
                    './magento-compatibility':
                        '<rootDir>/magento-compatibility.js'
                }
            })
        )
    ],
    // Include files with zero tests in overall coverage analysis by specifying
    // coverage paths manually.
    collectCoverage: true,
    collectCoverageFrom: [
        // Code directories
        'packages/*/{src,lib,_buildpack}/**/*.js',
        // Not the create-pwa package, which requires manual testing
        '!packages/create-pwa/**/*.js',
        // Not node_modules
        '!**/node_modules/**',
        // Not __tests__, __helpers__, or __any_double_underscore_folders__
        '!**/__[[:alpha:]]*__/**',
        '!**/.*/__[[:alpha:]]*__/**',
        // Not this file itself
        '!jest.config.js'
    ],
    // Don't look for test files in these directories.
    testPathIgnorePatterns: [
        'dist',
        'node_modules',
        '__fixtures__',
        '__helpers__',
        '__snapshots__'
    ]
};

if (process.env.npm_lifecycle_event === 'test:ci') {
    // Extract test filename from full path, for use in JUnit report attributes.
    const testPathRE = /(^\/packages\/[^\/]+\/|\.spec|\/__tests?__)/g;
    const testPathToFilePath = filepath => filepath.replace(testPathRE, '');

    // Add JUnit reporter for use in CI.
    jestConfig.reporters = [
        'default',
        [
            'jest-junit',
            {
                suiteName: 'Jest unit and functional tests',
                output: './test-results/jest/results.xml',
                suiteNameTemplate: ({ displayName, filepath }) =>
                    `${displayName}: ${testPathToFilePath(
                        testPathToFilePath(filepath)
                    )}`,
                classNameTemplate: ({ classname, title }) =>
                    classname !== title ? classname : '',
                titleTemplate: '{title}'
            }
        ]
    ];
}

module.exports = jestConfig;
