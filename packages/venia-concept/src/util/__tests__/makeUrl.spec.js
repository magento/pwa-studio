let makeUrl;

beforeEach(() => {
    jest.resetModuleRegistry();
});

const fastly = toggle => {
    process.env.USE_FASTLY = toggle;
    makeUrl = require('../makeUrl').default;
};

const FASTLY_CONSTANT_PARAMETERS = 'auto=webp&format=pjpg';

const JEST_HOST = window.location.href;

const absoluteUrls = [
    'data://example.com/foo.png',
    'http://example.com/bar.png',
    'https://example.com/baz.png'
];
const relativeUrl = '/some/path/to/img.jpg';
const leadingSlash = '/foo.jpg';
const noLeadingSlash = 'foo.jpg';

test('returns absolute path with no options unmodified', () => {
    fastly(false);
    absoluteUrls.forEach(url => {
        expect(makeUrl(url)).toBe(url);
    });
});

test('USE_FASTLY: returns absolute path with no options unmodified', () => {
    fastly(true);
    absoluteUrls.forEach(url => {
        expect(makeUrl(url)).toBe(`${url}?${FASTLY_CONSTANT_PARAMETERS}`);
    });
});

test('returns untyped, unresized url unmodified', () => {
    fastly(false);
    expect(makeUrl(relativeUrl)).toBe(JEST_HOST + relativeUrl);
});

test('FASTLY: returns untyped, unresized url unmodified', () => {
    fastly(true);
    expect(makeUrl(relativeUrl)).toBe(
        `${JEST_HOST}${relativeUrl}?${FASTLY_CONSTANT_PARAMETERS}`
    );
});

test('normalizes slash paths on typed urls', () => {
    fastly(false);
    expect(makeUrl(leadingSlash, { type: 'image-product' })).toBe(
        JEST_HOST + '/media/catalog/product/foo.jpg'
    );
    expect(makeUrl(noLeadingSlash, { type: 'image-category' })).toBe(
        JEST_HOST + '/media/catalog/category/foo.jpg'
    );
});

test('FASTLY: normalizes slash paths on typed urls', () => {
    fastly(true);
    expect(makeUrl(leadingSlash, { type: 'image-product' })).toBe(
        `${JEST_HOST}/media/catalog/product/foo.jpg?${FASTLY_CONSTANT_PARAMETERS}`
    );
    expect(makeUrl(noLeadingSlash, { type: 'image-category' })).toBe(
        `${JEST_HOST}/media/catalog/category/foo.jpg?${FASTLY_CONSTANT_PARAMETERS}`
    );
});

test('resizes but does not prepend path when width is passed but not type', () => {
    fastly(false);
    expect(makeUrl(absoluteUrls[0], { width: 100 })).toBe(
        'data://example.com/foo.png?auto=webp&format=pjpg&width=100'
    );
});

test('FASTLY: resizes but does not prepend path when width is passed but not type', () => {
    fastly(true);
    expect(makeUrl(absoluteUrls[0], { width: 100 })).toBe(
        'data://example.com/foo.png?auto=webp&format=pjpg&width=100'
    );
});

test('resizes urls to specific widths', () => {
    fastly(false);
    expect(
        makeUrl('some/category.jpg', { type: 'image-category', width: 160 })
    ).toBe(
        JEST_HOST +
            'img/resize/160?url=%2Fmedia%2Fcatalog%2Fcategory%2Fsome%2Fcategory.jpg'
    );
});

test('FASTLY: resizes urls to specific widths', () => {
    fastly(true);
    expect(
        makeUrl('some/category.jpg', { type: 'image-category', width: 160 })
    ).toBe(
        `${JEST_HOST}media/catalog/category/some/category.jpg?${FASTLY_CONSTANT_PARAMETERS}&width=160`
    );
});

test('errors on unrecognized type', () => {
    fastly(false);
    expect(() => makeUrl('url', { type: 'invalid' })).toThrow(
        'Unrecognized media type invalid'
    );
});
