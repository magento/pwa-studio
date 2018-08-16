const { join } = require('path');

module.exports = {
    displayName: 'Venia Concept',
    browser: true,
    testURL: 'https://localhost/',
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        // Mirrors webpack alias to resolve from 'src'
        '^src$': '<rootDir>/src',
        '^src/(.+)': '<rootDir>/src/$1',
        // Re-write imports to Peregrine to ensure they're not pulled from the
        // (possibly outdated) build artifacts on disk in `dist`.
        // Ideally this rule would be in the root Jest config, but Jest's config
        // merging strategy isn't currently smart enough for this. TODO: Look
        // into moving to root config in later versions of Jest if config merging
        // improves
        '^@magento/peregrine(/*(?:.+)*)': join(__dirname, '../peregrine/src/$1')
    },
    // Have Jest use Babel to transpile Peregrine imports in tests, since
    // our cross-package tests in the monorepo should all operate on `src`
    transformIgnorePatterns: ['node_modules/(?!@magento/peregrine)'],
    testPathIgnorePatterns: ['dist', 'node_modules']
};
