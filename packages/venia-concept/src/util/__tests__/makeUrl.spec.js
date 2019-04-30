import makeUrl from '../makeUrl';

const productBase = '/media/catalog/product';
const categoryBase = '/media/catalog/category';
const defaultParams = 'auto=webp&format=pjpg';

const relativePath = '/some/path/to/img.jpg';
const absoluteUrls = [
    'data://example.com/foo.png',
    'http://example.com/bar.png',
    'https://example.com/baz.png'
];

test('returns absolute url unmodified when called with no options', () => {
    absoluteUrls.forEach(url => {
        expect(makeUrl(url)).toBe(url);
    });
});

test('returns relative path unmodified when called with no options', () => {
    expect(makeUrl(relativePath)).toBe(relativePath);
});

test('adds no behavior when type is unrecognized', () => {
    const invalidType = 'invalid';
    expect(makeUrl(relativePath, { type: invalidType })).toEqual(relativePath);
});

test('prepends media path for product images', () => {
    expect(makeUrl(relativePath, { type: 'image-product' })).toBe(
        `${productBase}${relativePath}?${defaultParams}`
    );
    expect(makeUrl(absoluteUrls[2], { type: 'image-product' })).toBe(
        absoluteUrls[2]
    );
});

test('prepends media path for relative category images', () => {
    expect(makeUrl(relativePath, { type: 'image-category' })).toBe(
        `${categoryBase}${relativePath}?${defaultParams}`
    );
    expect(makeUrl(absoluteUrls[2], { type: 'image-category' })).toBe(
        absoluteUrls[2]
    );
});

test("doesn't prepend media path if it's already included", () => {
    const cachedPath = `${productBase}/foo.jpg`;

    expect(
        makeUrl(cachedPath, { type: 'image-product' }).startsWith(cachedPath)
    ).toBeTruthy();
});

test('rewrites absolute url when width is provided', () => {
    const width = 100;
    const raw = absoluteUrls[2];

    expect(makeUrl(raw, { type: 'image-product', width })).toBe(
        `${raw}?width=100`
    );
});

test('includes media path when rewriting for resizing', () => {
    const width = 100;

    expect(makeUrl(relativePath, { width, type: 'image-product' })).toBe(
        `${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});

test('uses fastly origin if present', () => {
    jest.resetModules();
    const width = 100;
    document
        .querySelector('html')
        .setAttribute(
            'data-fastly-origin',
            'https://fastly.origin:8000/somewhere'
        );
    const makeFastlyUrl = require('../makeUrl').default;
    expect(makeFastlyUrl(relativePath, { width, type: 'image-product' })).toBe(
        `https://fastly.origin:8000${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});
