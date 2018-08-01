module.exports = {
    displayName: 'Peregrine',
    setupFiles: [
        '<rootDir>/scripts/shim.js',
        '<rootDir>/scripts/fetch-mock.js'
    ],
    browser: true,
    testURL: 'https://localhost/',
    coveragePathIgnorePatterns: ['scripts/*', 'node_modules', 'src/index.js'],
    testPathIgnorePatterns: ['dist', 'node_modules']
};
