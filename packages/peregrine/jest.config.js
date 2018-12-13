module.exports = {
    browser: true,
    coveragePathIgnorePatterns: ['scripts/*', 'node_modules', 'src/index.js'],
    displayName: 'Peregrine',
    setupFiles: [
        '<rootDir>/scripts/shim.js',
        '<rootDir>/scripts/fetch-mock.js'
    ],
    setupTestFrameworkScriptFile: '<rootDir>/jest.setup.js',
    testPathIgnorePatterns: ['dist', 'node_modules'],
    testURL: 'https://localhost/'
};
