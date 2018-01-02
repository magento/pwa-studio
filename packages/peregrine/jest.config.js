module.exports = {
    setupFiles: ['<rootDir>/scripts/shim.js'],
    verbose: true,
    collectCoverageFrom: ['src/**/*.js'],
    silent: !process.env.DEBUG
};
