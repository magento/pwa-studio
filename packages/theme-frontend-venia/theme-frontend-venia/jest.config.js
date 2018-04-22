module.exports = {
    verbose: true,
    browser: true,
    collectCoverage: true,
    testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '^src/(.+)': '<rootDir>/src/$1'
    }
};
