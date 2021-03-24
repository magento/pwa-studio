import { generateSrcset, imageWidths } from '../imageUtils';

test('generateSrcset should return a string', () => {
    expect(typeof generateSrcset('google.com', 'image-product')).toBe('string');
});

test('generateSrcset should return empty string if either of the arguments are falsey', () => {
    expect(generateSrcset()).toBe('');
    expect(generateSrcset('')).toBe('');
    expect(generateSrcset('google.com')).toBe('');
    expect(generateSrcset('', 'image-product')).toBe('');
    expect(generateSrcset(null, null)).toBe('');
    expect(generateSrcset(undefined, undefined)).toBe('');
    expect(generateSrcset('google.com', 'image-product')).not.toBe('');
});

test('generateSrcset should return srcset for all widths in imageWidths', () => {
    const result = generateSrcset('google.com', 'image-product');
    expect(result.split(',')).toHaveLength(imageWidths.size);
});
