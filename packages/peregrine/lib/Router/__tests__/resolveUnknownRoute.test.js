import resolveUnknownRoute from '../resolveUnknownRoute';
import * as persistence from '../../util/simplePersistence';
jest.mock('../../util/simplePersistence');

const NotFoundResponse = {
    type: 'NOTFOUND',
    id: -1
};

const CmsPageResponse = {
    type: 'CMS_PAGE',
    id: 3
};

const ProductPageResponse = {
    type: 'PRODUCT',
    id: 2
};

const CategoryPageResponse = {
    type: 'CATEGORY',
    id: 1
};

const urlResolverJson = ({ type, id }) => ({
    data: {
        urlResolver: { type, id }
    }
});

const isOnline = _value => ({
    get: () => _value,
    set: v => (_value = v)
});

Object.defineProperty(navigator, 'onLine', isOnline(true));

beforeEach(() => {
    persistence.mockGetItem.mockReset();
    persistence.mockSetItem.mockReset();
    persistence.mockRemoveItem.mockReset();
    fetch.resetMocks();
    navigator.onLine = true;
    document.body.innerHTML = '';
    resolveUnknownRoute.preloadDone = false;
});

test('Preload path: resolves directly from preload attributes', async () => {
    document.body.setAttribute('data-model-type', 'CATEGORY');
    document.body.setAttribute('data-model-id', '45');
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://example.com'
    });
    expect(res).toMatchObject({
        type: 'CATEGORY',
        id: 45
    });
    document.body.removeAttribute('data-model-type');
    document.body.removeAttribute('data-model-id');
});

test('Preload path: resolves directly from preload element', async () => {
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver">{ "type": "PRODUCT", "id": "VA-123" }</script>';
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://example.com'
    });
    expect(res).toMatchObject({
        type: 'PRODUCT',
        id: 'VA-123'
    });
});

test('returns NOTFOUND when offline and requested content is not in cache ', async () => {
    navigator.onLine = false;

    persistence.mockGetItem.mockReturnValueOnce(undefined);

    const res1 = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });

    expect(res1).toMatchObject(NotFoundResponse);

    persistence.mockGetItem.mockReturnValueOnce({});

    const res2 = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });

    expect(res2).toMatchObject(NotFoundResponse);
});

test('stores response of urlResolver in cache', async () => {
    fetch.mockResponseOnce(
        JSON.stringify(urlResolverJson(ProductPageResponse))
    );

    const url = 'foo-bar.html';

    await resolveUnknownRoute({
        route: url,
        apiBase: 'https://store.com'
    });

    expect(persistence.mockSetItem).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
            [url]: urlResolverJson(ProductPageResponse)
        }),
        expect.any(Number)
    );
});

test('does not call fetchRoute when response is cached', async () => {
    const url = 'foo/baz.html';

    persistence.mockGetItem.mockReturnValueOnce({
        [url]: urlResolverJson(CmsPageResponse)
    });

    await expect(
        resolveUnknownRoute({
            route: url,
            apiBase: 'https://store.com'
        })
    ).resolves.toMatchObject(CmsPageResponse);

    expect(fetch).toHaveBeenCalledTimes(0);
});

test('calls fetchRoute when response is not cached', async () => {
    fetch.mockResponseOnce(
        JSON.stringify(urlResolverJson(ProductPageResponse))
    );

    await expect(
        resolveUnknownRoute({
            route: 'foo-bar.html',
            apiBase: 'https://store.com'
        })
    ).resolves.toMatchObject(ProductPageResponse);

    expect(fetch).toHaveBeenCalledTimes(1);
});

test('urlResolver path: throws errors from GraphQL and does not cache', async () => {
    fetch.mockResponseOnce(
        JSON.stringify({
            errors: [{ message: 'Terrible!!!' }, { message: 'Just the worst' }]
        })
    );
    await expect(
        resolveUnknownRoute({
            route: 'anything',
            apiBase: 'https://store.com'
        })
    ).rejects.toThrow('urlResolver query failed');
});

test('Preload path: skips if preload element not found', async () => {
    fetch.mockResponseOnce(
        JSON.stringify(urlResolverJson(CategoryPageResponse))
    );

    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject(CategoryPageResponse);
});

test('Preload path: skips if preload element unparseable', async () => {
    fetch.mockResponseOnce(
        JSON.stringify(urlResolverJson(CategoryPageResponse))
    );
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver"> "type": "CMS_PAGE", "id": "1" }</script>';

    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject(CategoryPageResponse);
});

test('Preload path: casts numbers to number', async () => {
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver">{ "type": "CMS_PAGE", "id": "1" }</script>';
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject({
        type: 'CMS_PAGE',
        id: 1
    });
});
