import makeUrl from '../makeUrl';

const FASTLY_CONSTANT_PARAMETERS = 'auto=webp&format=pjpg';
const JEST_HOST = window.location.href;

const leadingSlash = '/foo.jpg';
const noLeadingSlash = 'foo.jpg';
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

test('FASTLY: returns absolute url with fastly params', () => {
    absoluteUrls.forEach(url => {
        expect(makeUrl(url, { useFastly: true })).toBe(
            `${url}?${FASTLY_CONSTANT_PARAMETERS}`
        );
    });
});

test('makes relative path an absolute url', () => {
    const expected = new URL(relativePath, JEST_HOST);

    expect(makeUrl(relativePath)).toBe(expected.href);
});

test('FASTLY: makes relative path an absolute url with fastly params', () => {
    const expected = new URL(relativePath, JEST_HOST);

    expect(makeUrl(relativePath, { useFastly: true })).toBe(
        `${expected.href}?${FASTLY_CONSTANT_PARAMETERS}`
    );
});

test('normalizes slash paths on typed urls', () => {
    const expected = new URL('/foo.jpg', JEST_HOST);

    expect(makeUrl(leadingSlash)).toBe(expected.href);
    expect(makeUrl(noLeadingSlash)).toBe(expected.href);
});

test('FASTLY: normalizes slash paths on typed urls', () => {
    const expected = new URL('/foo.jpg', JEST_HOST);

    expect(makeUrl(leadingSlash, { useFastly: true })).toBe(
        `${expected.href}?${FASTLY_CONSTANT_PARAMETERS}`
    );
    expect(makeUrl(noLeadingSlash, { useFastly: true })).toBe(
        `${expected.href}?${FASTLY_CONSTANT_PARAMETERS}`
    );
});

test('resizes but does not prepend path when width is passed but not type', () => {
    const raw = absoluteUrls[2];
    const expected = new URL(raw);

    expect(makeUrl(raw, { width: 100 })).toBe(
        `${
            expected.origin
        }/img/resize/100?url=https%3A%2F%2Fexample.com%2Fbaz.png`
    );
});

test('FASTLY: resizes but does not prepend path when width is passed but not type', () => {
    const raw = absoluteUrls[2];
    const expected = new URL(raw);

    expect(makeUrl(raw, { width: 100, useFastly: true })).toBe(
        `${expected.origin}/baz.png?auto=webp&format=pjpg&width=100`
    );
});

test('resizes urls to specific widths', () => {
    const expected = new URL(
        'img/resize/160?url=%2Fsome%2Fcategory.jpg',
        JEST_HOST
    );

    expect(
        makeUrl('/some/category.jpg', { type: 'image-category', width: 160 })
    ).toBe(expected.href);
});

test('FASTLY: resizes urls to specific widths', () => {
    const expected = new URL(
        `/some/category.jpg?${FASTLY_CONSTANT_PARAMETERS}&width=160`,
        JEST_HOST
    );

    expect(
        makeUrl('/some/category.jpg', {
            width: 160,
            useFastly: true
        })
    ).toBe(expected.href);
});
