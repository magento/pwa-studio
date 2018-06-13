module.exports = {
    displayName: 'Peregrine',
    setupFiles: [
        '<rootDir>/scripts/shim.js',
        '<rootDir>/scripts/fetch-mock.js'
    ],
    coveragePathIgnorePatterns: ['scripts/*', 'node_modules', 'src/index.js']
};
