const testPathRE = /(^\/packages\/[^\/]+\/|\.spec|\/__tests?__)/g;
const testPathToFilePath = filepath => filepath.replace(testPathRE, '');
module.exports = {
    projects: [
        'packages/peregrine',
        'packages/pwa-buildpack',
        'packages/venia-concept'
    ],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js', '!**/__stories__/**'],
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
