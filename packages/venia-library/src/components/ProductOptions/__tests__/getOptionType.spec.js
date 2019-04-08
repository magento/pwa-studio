import getOptionType from '../getOptionType';

test('returns undefined by default', () => {
    expect(getOptionType()).toBeUndefined();
});

test('returns undefined for unrecognized attribute code', () => {
    const option = { attribute_code: '__foo' };

    expect(getOptionType(option)).toBeUndefined();
});

test('identifies `fashion_color` as a `swatch` attribute', () => {
    const option = { attribute_code: 'fashion_color' };

    expect(getOptionType(option)).toBe('swatch');
});
