import makeUrl from '../makeUrl';

const productBase = '/media/catalog/product';
const categoryBase = '/media/catalog/category';
const resizeBase = '/img/resize';

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

test('throws if type is unrecognized', () => {
    const invalidType = 'invalid';
    const thrower = () => {
        makeUrl(relativePath, { type: invalidType });
    };

    expect(thrower).toThrow(invalidType);
});

test('prepends media path for product images', () => {
    expect(makeUrl(relativePath, { type: 'image-product' })).toBe(
        `${productBase}${relativePath}`
    );
    expect(makeUrl(absoluteUrls[2], { type: 'image-product' })).toBe(
        `${productBase}${new URL(absoluteUrls[2]).pathname}`
    );
});

test('prepends media path for category images', () => {
    expect(makeUrl(relativePath, { type: 'image-category' })).toBe(
        `${categoryBase}${relativePath}`
    );
    expect(makeUrl(absoluteUrls[2], { type: 'image-category' })).toBe(
        `${categoryBase}${new URL(absoluteUrls[2]).pathname}`
    );
});

test("doesn't prepend media path if it's already included", () => {
    const cachedPath = `${productBase}/foo.jpg`;

    expect(makeUrl(cachedPath, { type: 'image-product' })).toBe(cachedPath);
});

test('rewrites absolute url when width is provided', () => {
    const width = 100;
    const raw = absoluteUrls[2];
    const { pathname } = new URL(raw);

    expect(makeUrl(raw, { width })).toBe(
        `${resizeBase}/${width}?url=${encodeURIComponent(pathname)}`
    );
});

test('rewrites relative path when width is provided', () => {
    const width = 100;

    expect(makeUrl(relativePath, { width })).toBe(
        `${resizeBase}/${width}?url=${encodeURIComponent(relativePath)}`
    );
});

test('includes media path when rewriting for resizing', () => {
    const width = 100;

    expect(makeUrl(relativePath, { width, type: 'image-product' })).toBe(
        `${resizeBase}/${width}?url=${encodeURIComponent(
            productBase + relativePath
        )}`
    );
});
