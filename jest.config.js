const path = require('path');
const testPathRE = /(^\/packages\/[^\/]+\/|\.spec|\/__tests?__)/g;
const testPathToFilePath = filepath => filepath.replace(testPathRE, '');
const testGlob = '/**/__tests__/*.(test|spec).js';
const packagePath = (...segments) =>
    path.join('<rootDir>', 'packages', ...segments);
// const packageAbsolutePath = (...segments) =>
//     path.join(__dirname, 'packages', ...segments);
const packageTestMatch = pkg => [packagePath(pkg, testGlob)];
module.exports = {
    projects: [
        {
            displayName: 'Peregrine',
            testMatch: packageTestMatch('peregrine'),
            coveragePathIgnorePatterns: [
                packagePath('peregrine', 'scripts/*'),
                packagePath('peregrine', 'node_modules'),
                packagePath('peregrine', 'src/index.js')
            ],
            setupFiles: [
                packagePath('peregrine', 'scripts/shim.js'),
                packagePath('peregrine', 'scripts/fetch-mock.js')
            ],
            setupTestFrameworkScriptFile: packagePath(
                'peregrine',
                'jest.setup.js'
            )
        },
        {
            displayName: 'Buildpack',
            testMatch: packageTestMatch('pwa-buildpack'),
            testEnvironment: 'node'
        },
        {
            displayName: 'Upward JS',
            testMatch: packageTestMatch('upward-js'),
            testEnvironment: 'node'
        },
        {
            displayName: 'Venia Concept',
            testMatch: packageTestMatch('venia-concept'),
            moduleNameMapper: {
                // Peregrine imports a virtual module that must be mocked.
                // It would be nice if Venia respected a mock in Peregrine,
                // but it doesn't, so Venia tests will fail without this.
                '^FETCH_ROOT_COMPONENT$': packagePath(
                    'venia-concept',
                    '__mocks__/virtualModule.js'
                ),
                '\\.(jpg|jpeg|png)$': packagePath(
                    'venia-concept',
                    '__mocks__/fileMock.js'
                ),
                '\\.css$': 'identity-obj-proxy',
                // Mirrors webpack alias to resolve from 'src'
                '^src/(.+)': packagePath('venia-concept', '/src/$1'),
                // Re-write imports to Peregrine to ensure they're not pulled from the
                // (possibly outdated) build artifacts on disk in `dist`.
                // Ideally this rule would be in the root Jest config, but Jest's config
                // merging strategy isn't currently smart enough for this. TODO: Look
                // into moving to root config in later versions of Jest if config merging
                // improves
                '^@magento/peregrine(/*(?:.+)*)': packagePath(
                    'peregrine',
                    'src/$1'
                )
            },
            transform: {
                '\\.(gql|graphql)$': 'jest-transform-graphql',
                '.*': 'babel-jest'
            },
            // Have Jest use Babel to transpile Peregrine imports in tests, since
            // our cross-package tests in the monorepo should all operate on `src`
            transformIgnorePatterns: ['node_modules/(?!@magento/peregrine)'],
            setupTestFrameworkScriptFile: packagePath(
                'venia-concept',
                'jest.setup.js'
            )
        },
        {
            displayName: 'CI Scripts',
            testMatch: [`<rootDir>/scripts/${testGlob}`],
            testEnvironment: 'node'
        }
    ],
    browser: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'scripts/**/*.js',
        'src/**/*.js',
        'lib/**/*.js',
        '!**/__stories__/**',
        '!**/__helpers__/**'
    ],
    testPathIgnorePatterns: [
        'dist',
        'node_modules',
        '__fixtures__',
        '__helpers__',
        '__snapshots__'
    ],
    testURL: 'https://localhost/',
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy'
    },
    reporters: [
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
    ]
};
