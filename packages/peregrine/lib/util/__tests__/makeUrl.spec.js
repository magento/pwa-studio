import makeUrl from '../makeUrl';

const mediaPath = '/media';
const productBase = '/catalog/product';
const categoryBase = '/catalog/category';
const defaultParams = 'auto=webp&format=pjpg';

const relativePath = '/some/path/to/img.jpg';
const absoluteUrls = [
    'data://example.com/foo.png',
    'http://example.com/bar.png',
    'https://example.com/baz.png'
];

beforeEach(() => {
    global.AVAILABLE_STORE_VIEWS = [
        {
            base_currency_code: 'USD',
            store_code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            secure_base_media_url: 'https://cdn.origin:9000/media/',
            store_name: 'Default Store View'
        }
    ];
});

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
        `${mediaPath}${productBase}${relativePath}?${defaultParams}`
    );
});

test('prepends media path for relative category images', () => {
    expect(makeUrl(relativePath, { type: 'image-category' })).toBe(
        `${mediaPath}${categoryBase}${relativePath}?${defaultParams}`
    );
});

test("doesn't prepend media path if it's already included", () => {
    const cachedPath = `${productBase}/foo.jpg`;

    expect(
        makeUrl(cachedPath, { type: 'image-product' }).startsWith(cachedPath)
    ).toBeTruthy();
});

test('appends opt params to absolute url when width is provided', () => {
    const width = 100;
    const raw = absoluteUrls[2];

    expect(makeUrl(raw, { type: 'image-product', width })).toBe(
        `https://example.com/baz.png?auto=webp&format=png&width=100`
    );
});

test('appends all configured arguments for wysiwyg images', () => {
    const raw = absoluteUrls[2];

    expect(
        makeUrl(raw, {
            type: 'image-wyswiyg',
            width: 100,
            height: 100,
            quality: 85,
            crop: false,
            fit: 'cover'
        })
    ).toBe(
        `https://example.com/baz.png?auto=webp&format=png&width=100&height=100&quality=85&crop=false&fit=cover`
    );
});

test('appends format=png if the filetype is png', () => {
    const raw = 'https://example.com/baz.png';

    expect(makeUrl(raw, { type: 'image-product' })).toBe(
        `${raw}?auto=webp&format=png`
    );
});

test('appends format=pjpg if the filetype is not png', () => {
    const raw1 = 'https://example.com/baz.jpeg';

    expect(makeUrl(raw1, { type: 'image-product' })).toBe(
        `${raw1}?auto=webp&format=pjpg`
    );

    const raw2 = 'https://example.com/baz.gif';

    expect(makeUrl(raw2, { type: 'image-product' })).toBe(
        `${raw2}?auto=webp&format=pjpg`
    );
});

test('includes media path when rewriting for resizing', () => {
    const width = 100;

    expect(makeUrl(relativePath, { width, type: 'image-product' })).toBe(
        `${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});

test('removes absolute origin if configured to', () => {
    jest.resetModules();
    const width = 100;
    process.env.MAGENTO_BACKEND_URL = 'https://cdn.origin:8000/';
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('data-image-optimizing-origin', 'onboard');
    const makeUrlAbs = require('../makeUrl').default;
    expect(
        makeUrlAbs(
            `https://cdn.origin:8000${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`,
            { width, type: 'image-product' }
        )
    ).toBe(
        `${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});

test('removes absolute origin if configured to - with path', () => {
    jest.resetModules();
    const width = 100;
    process.env.MAGENTO_BACKEND_URL = 'https://cdn.origin:8000/venia/';
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('data-image-optimizing-origin', 'onboard');
    const makeUrlAbs = require('../makeUrl').default;
    expect(
        makeUrlAbs(
            `https://cdn.origin:8000/venia${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`,
            { width, type: 'image-product' }
        )
    ).toBe(
        `${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});

test('prepends absolute origin if configured to', () => {
    jest.resetModules();
    const width = 100;
    const htmlTag = document.querySelector('html');
    htmlTag.setAttribute('data-image-optimizing-origin', 'backend');
    const makeUrlAbs = require('../makeUrl').default;
    expect(
        makeUrlAbs(
            `${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`,
            { width, type: 'image-product' }
        )
    ).toBe(
        `https://cdn.origin:9000${mediaPath}${productBase}${relativePath}?auto=webp&format=pjpg&width=100`
    );
});
