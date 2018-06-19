module.exports = {
    projects: [
        'packages/peregrine',
        'packages/pwa-buildpack',
        'packages/venia-concept'
    ],
    collectCoverage: true,
    // Jest's `collectCoverageFrom` option will only collect coverage
    // from one project when using the multi-project runner and keeping
    // these configs in each project's config, so we have to keep them
    // here. TODO: Check in future version of Jest if this is fixed
    collectCoverageFrom: ['src/**/*.js', '!**/__stories__/**']
};
