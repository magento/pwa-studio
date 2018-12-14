import patches from '../intlPatches';
import IntlPolyfill from 'intl';

const patchedFormatter = cfg =>
    new Proxy(Intl.NumberFormat(undefined, cfg), {
        get(target, prop) {
            if (prop === 'formatToParts') {
                return false;
            }
            if (prop === 'resolvedOptions') {
                return () => target.resolvedOptions();
            }
            return target[prop];
        }
    });
const standardFormatter = cfg => IntlPolyfill.NumberFormat(undefined, cfg);
require('intl/locale-data/jsonp/en.js');

const formatToPartsPatch = jest.spyOn(patches, 'formatToPartsPatch');

// IntlPolyfill behaves differently on Node 8 and Node 10, but only in small
// ways; namely, for an unrecognized currency, Node 10 inserts additional
// whitespace between the currency code and the first integer.
// This test shouldn't care about whitespace, so we pass everything through
// a filter function that strips those literals with whitespace.
const stripWhitespaceFromParts = parts =>
    parts.filter(
        ({ type, value }) => !(type === 'literal' && /^\s*$/.test(value))
    );

const callToParts = (formatter, config, num) =>
    stripWhitespaceFromParts(patches.toParts.call(formatter(config), num));

const compareOutputs = (config, num) =>
    expect(callToParts(patchedFormatter, config, num)).toEqual(
        callToParts(standardFormatter, config, num)
    );

test('does not use patch if native method exists', () => {
    callToParts(
        standardFormatter,
        { style: 'currency', currency: 'usd' },
        12000
    );
    expect(formatToPartsPatch).not.toHaveBeenCalled();
});

test('matches grouped USD format if currency unrecognized', () =>
    compareOutputs(
        {
            style: 'currency',
            currency: 'YTT'
        },
        12000
    ));

test('matches USD format with no grouping', () =>
    compareOutputs(
        {
            style: 'currency',
            currency: 'USD',
            useGrouping: false
        },
        12000
    ));

test('handles zero input', () =>
    compareOutputs({ style: 'currency', currency: 'USD' }, 0));

test('fixes and rounds decimals', () =>
    compareOutputs({ style: 'currency', currency: 'USD' }, 100.1285));

test('matches EUR format', () =>
    compareOutputs(
        {
            style: 'currency',
            currency: 'EUR',
            useGrouping: false
        },
        100000.99
    ));
