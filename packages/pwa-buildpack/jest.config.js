module.exports = {
    displayName: 'Buildpack',
    clearMocks: true,
    setupFiles: ['<rootDir>/scripts/alwaysMock.js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'node_modules', '__fixtures__']
};
