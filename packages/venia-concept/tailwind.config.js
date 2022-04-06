// TODO @TW:
// Node path should be committed, but it makes preset dev impossible.
// Local path is the only way to develop "tailwind.preset.js".
const venia = require('@magento/pwa-theme-venia');
// const venia = require('../pwa-theme-venia');

const config = {
    mode: 'jit',
    // Include your custom theme here.
    presets: [venia],
    // Configure how Tailwind statically analyzes your code here.
    // Note that the Tailwind's `jit` mode doesn't actually use PurgeCSS.
    purge: {
        // Include paths to every file that may refer to Tailwind classnames.
        // Classnames not found in these files will be excluded at build time.
        content: [
            './node_modules/@magento/venia-ui/lib/**/*.module.css',
            '../venia-ui/lib/**/*.module.css',
            './src/**/*.module.css',
            './template.html'
        ],
        // Extract Tailwind classnames from source files.
        // Our default matcher only matches targets of CSS Modules' `composes`,
        // not classnames included directly in HTML or JS!
        extractors: [
            {
                extensions: ['css'],
                extractor: content => content.match(matcher) || []
            }
        ]
    },
    // Set the character Tailwind uses when prefixing classnames with variants.
    // CSS Modules doesn't like Tailwind's default `:`, so we use `_`.
    separator: '_',
    theme: {
        extend: {}
    }
};

module.exports = config;

/**
 * Matches declarations that contain tailwind classnames.
 * Only classnames matched by this expression will be included in the build.
 *
 * @example
 * .foo {
 *   composes: mx-auto from global;
 * }
 */
const matcher = /(?<=composes:.*)(\b\S+\b)(?=.*from global;)/g;
