module.exports = {
    verbose: true,
    collectCoverage: true,
    projects: [
        {
            displayName: 'theme',
            testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
            browser: true,
            moduleNameMapper: {
                '\\.css$': 'identity-obj-proxy',
                '^src/(.+)': '<rootDir>/src/$1'
            }
        },
        {
            displayName: 'devtools',
            testMatch: ['<rootDir>/devtools/**/__tests__/*.spec.js'],
            browser: false,
            testEnvironment: 'node',
            collectCoverageFrom: ['devtools/**/*.js'],
            moduleNameMapper: {
                // There is no `src` dir or `.css` files in the `devtools`
                // dir, so these are a noop. But they're circumventing a bug in
                // Jest's multi-project runner
                '\\.css$': 'identity-obj-proxy',
                '^src/(.+)': '<rootDir>/src/$1'
            }
        }
    ]
};
