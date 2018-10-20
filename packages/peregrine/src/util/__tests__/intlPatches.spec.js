/**
 * This test assumes Node 8, which does not support the formatToParts method.
 */
import patches from '../intlPatches';
import IntlPolyfill from 'intl';

const patched = cfg => Intl.NumberFormat(undefined, cfg);
const standard = cfg => IntlPolyfill.NumberFormat(undefined, cfg);
require('intl/locale-data/jsonp/en.js');

const formatToPartsPatch = jest.spyOn(patches, 'formatToPartsPatch');

test('does not use patch if native method exists', () => {
    patches.toParts.call(
        standard({ style: 'currency', currency: 'usd' }),
        12000
    );
    expect(formatToPartsPatch).not.toHaveBeenCalled();
});

test('matches grouped USD format if currency unrecognized', () => {
    const config = {
        style: 'currency',
        currency: 'YTT'
    };
    expect(patches.toParts.call(patched(config), 12000)).toEqual(
        patches.toParts.call(standard(config), 12000)
    );
});

test('matches USD format with no grouping', () => {
    const config = {
        style: 'currency',
        currency: 'USD',
        useGrouping: false
    };
    expect(patches.toParts.call(patched(config), 12000)).toEqual(
        patches.toParts.call(standard(config), 12000)
    );
});

test('handles zero input', () => {
    const config = {
        style: 'currency',
        currency: 'USD'
    };
    expect(patches.toParts.call(patched(config), 0)).toEqual(
        patches.toParts.call(standard(config), 0)
    );
});

test('fixes and rounds decimals', () => {
    const config = {
        style: 'currency',
        currency: 'USD'
    };
    expect(patches.toParts.call(patched(config), 100.1285)).toEqual(
        patches.toParts.call(standard(config), 100.1285)
    );
});

test('matches EUR format', () => {
    const config = {
        style: 'currency',
        currency: 'EUR',
        useGrouping: false
    };
    expect(patches.toParts.call(patched(config), 100000.99)).toEqual(
        patches.toParts.call(standard(config), 100000.99)
    );
});
