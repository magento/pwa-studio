module.exports = {
    projects: [
        'packages/peregrine',
        'packages/pwa-buildpack',
        'packages/venia-concept'
    ],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js', '!**/__stories__/**']
};
