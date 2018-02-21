module.exports = {
    verbose: true,
    collectCoverage: true,
    projects: [
        {
            displayName: 'theme',
            testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
            browser: true,
            modulePaths: ['<rootDir>'],
            moduleNameMapper: {
                '\\.css$': '<rootDir>/__mocks__/style.js'
            }
        },
        {
            displayName: 'devtools',
            testMatch: ['<rootDir>/devtools/**/__tests__/*.spec.js'],
            browser: false,
            testEnvironment: 'node',
            collectCoverageFrom: ['devtools/**/*.js']
        }
    ]
};
