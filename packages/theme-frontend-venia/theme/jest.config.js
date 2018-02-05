module.exports = {
    verbose: true,
    collectCoverage: true,
    projects: [
        {
            displayName: 'theme',
            testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
            browser: true
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
