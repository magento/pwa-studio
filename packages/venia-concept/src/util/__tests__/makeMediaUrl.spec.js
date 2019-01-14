import makeMediaUrl from '../makeMediaUrl';

test('returns absolute path unmodified', () => {
    const absoluteUrl = 'https://example.com/foo.png';
    expect(makeMediaUrl(absoluteUrl)).toBe(absoluteUrl);
});

test('returns untyped, unresized url unmodified', () => {
    const relativeUrl = '/some/path/to/img.jpg';
    expect(makeMediaUrl(relativeUrl)).toBe(relativeUrl);
});

test('normalizes slash paths on typed urls', () => {
    const leadingSlash = '/foo.jpg';
    const noLeadingSlash = 'foo.jpg';
    expect(makeMediaUrl(leadingSlash, { type: 'product' })).toBe(
        '/media/catalog/product/foo.jpg'
    );
    expect(makeMediaUrl(noLeadingSlash, { type: 'category' })).toBe(
        '/media/catalog/category/foo.jpg'
    );
});

test('errors on unrecognized type', () => {
    expect(() => makeMediaUrl('url', { type: 'invalid' })).toThrow(
        'Unrecognized media type invalid'
    );
});

test('resizes urls to specific widths', () => {
    expect(
        makeMediaUrl('some/category.jpg', { type: 'category', width: 160 })
    ).toBe('/resize/160w/media/catalog/category/some/category.jpg');
    expect(makeMediaUrl('/some/other/thing.jpg', { width: 480 })).toBe(
        '/resize/480w/some/other/thing.jpg'
    );
});
