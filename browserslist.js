/*
 * Precise browser targeting reduces the amount of transpilation we do.
 * Dropping IE 11 support would have the greatest impact.
 * Read more: https://twitter.com/jamiebuilds/status/1022568923726639104
 */

const browsers = [
    '> 0.05%',
    'not dead',
    // "not ie 11",
    'not android 4.1',
    'not android 4.2',
    'not android 4.4',
    'not android 4.4.3',
    'not chrome 29',
    'not chrome 43',
    'not chrome 49',
    'not chrome 54',
    'not firefox 47',
    'not firefox 48',
    'not firefox 51',
    'not firefox 52',
    'not ios 8.1',
    'not ios 9.3',
    'not safari 5.1',
    'not safari 9.1'
];

module.exports = browsers;
