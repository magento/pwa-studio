module.exports = {
    setupFiles: [
        '<rootDir>/scripts/shim.js',
        '<rootDir>/scripts/fetch-mock.js'
    ],
    verbose: true,
    collectCoverageFrom: ['src/**/*.js', '!src/**/__stories__/**']
};
