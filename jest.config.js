const testPathRE = /(^\/packages\/[^\/]+\/|\.spec|\/__tests?__)/g;
const testPathToFilePath = filepath => filepath.replace(testPathRE, '');
module.exports = {
    projects: [
        'packages/peregrine',
        'packages/pwa-buildpack',
        'packages/upward-js',
        'packages/venia-concept',
        'scripts'
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'scripts/**/*.js',
        'src/**/*.js',
        'lib/**/*.js',
        '!**/__stories__/**',
        '!**/__helpers__/**'
    ],
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
