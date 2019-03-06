import resolveUnknownRoute from '../resolveUnknownRoute';

const urlResolverRes = (type, id) =>
    JSON.stringify({
        data: {
            urlResolver: { type, id }
        }
    });

const NotFoundManifest = {
    NotFound: {
        rootChunkID: -1,
        rootModuleID: 100,
        pageTypes: ['NOTFOUND']
    }
};

const mockManifest = {
    Category: {
        rootChunkID: 2,
        rootModuleID: 100,
        pageTypes: ['CATEGORY']
    },
    Product: {
        rootChunkID: 1,
        rootModuleID: 99,
        pageTypes: ['PRODUCT']
    },
    ...NotFoundManifest
};

const cachedResponse = JSON.stringify({
    'foo-bar.html': {
        ...JSON.parse(urlResolverRes('PRODUCT'))
    }
});

const isOnline = _value => ({
    get: () => _value,
    set: v => (_value = v)
});

Object.defineProperty(navigator, 'onLine', isOnline(true));

function clearLocalStorage(item) {
    localStorage.setItem(item, null);
}

beforeEach(() => {
    navigator.onLine = true;
    clearLocalStorage('urlResolve');
    document.body.innerHTML = '';
    resolveUnknownRoute.preloadDone = false;
    fetch.resetMocks();
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

    fetch.mockResponseOnce(JSON.stringify(mockManifest));
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(res).toHaveProperty('id', NotFoundManifest.NotFound.rootChunkID);
});

test('stores response of urlResolver in cache', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT'));
    fetch.mockResponseOnce(JSON.stringify(mockManifest));

    const url = 'foo-bar.html';

    await resolveUnknownRoute({
        route: url,
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(localStorage.getItem('urlResolve')).not.toBeNull();
});

test('does not call fetchRoute when response is cached', async () => {
    localStorage.setItem('urlResolve', cachedResponse);

    fetch.mockResponseOnce(JSON.stringify(mockManifest));
    await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(fetch).toHaveBeenCalledTimes(0);
});

test('calls fetchRoute when response is not cached', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT'));
    fetch.mockResponseOnce(JSON.stringify(mockManifest));
    await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(fetch).toHaveBeenCalledTimes(1);
});

test('urlResolver path: resolve using fetch to GraphQL after one preload', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT', 'VA-11'));
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver">{ "type": "CMS_PAGE", "id": "1" }</script>';
    const preloadRes = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(preloadRes).toMatchObject({
        type: 'CMS_PAGE',
        id: 1
    });
    expect(fetch).not.toHaveBeenCalled();
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject({
        type: 'PRODUCT',
        id: 'VA-11'
    });
    expect(fetch).toHaveBeenCalledTimes(1);
});

test('Preload path: skips if preload element not found', async () => {
    fetch.mockResponseOnce(urlResolverRes('CATEGORY', 2));
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject({
        type: 'CATEGORY',
        id: 2
    });
});

test('Preload path: skips if preload element unparseable', async () => {
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver"> "type": "CMS_PAGE", "id": "1" }</script>';
    fetch.mockResponseOnce(urlResolverRes('CATEGORY', 2));
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject({
        type: 'CATEGORY',
        id: 2
    });
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
