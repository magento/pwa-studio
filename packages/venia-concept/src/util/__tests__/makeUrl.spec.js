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
        'https://example.com/media/catalog/product/baz.png?auto=webp&format=pjpg'
    );
});

test('prepends media path for relative category images', () => {
    expect(makeUrl(relativePath, { type: 'image-category' })).toBe(
        `${categoryBase}${relativePath}?${defaultParams}`
    );
    expect(makeUrl(absoluteUrls[2], { type: 'image-category' })).toBe(
        'https://example.com/media/catalog/category/baz.png?auto=webp&format=pjpg'
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
        `https://example.com${productBase}/baz.png?auto=webp&format=pjpg&width=100`
    );
});

test('includes media path when rewriting for resizing', () => {
    const width = 100;

    expect(makeUrl(relativePath, { width, type: 'image-product' })).toBe(
        `${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});

test('removes absolute origin if configured to', () => {
    jest.resetModules();
    const width = 100;
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('data-backend', 'https://cdn.origin:8000/');
    htmlTag.setAttribute('data-image-optimizing-origin', 'onboard');
    const makeUrlAbs = require('../makeUrl').default;
    expect(
        makeUrlAbs(
            `https://cdn.origin:8000${productBase}${relativePath}?auto=webp&format=pjpg&width=100`,
            { width, type: 'image-product' }
        )
    ).toBe(`${productBase}${relativePath}?auto=webp&format=pjpg&width=100`);
});

test('prepends absolute origin if configured to', () => {
    jest.resetModules();
    const width = 100;
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('data-backend', 'https://cdn.origin:9000/');
    htmlTag.setAttribute('data-image-optimizing-origin', 'backend');
    const makeUrlAbs = require('../makeUrl').default;
    expect(
        makeUrlAbs(
            `${productBase}${relativePath}?auto=webp&format=pjpg&width=100`,
            { width, type: 'image-product' }
        )
    ).toBe(
        `https://cdn.origin:9000${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});
