import resolveUnknownRoute from '../resolveUnknownRoute';

const urlResolverRes = type =>
    JSON.stringify({
        data: {
            urlResolver: { type }
        }
    });

const NotFoundManifest = {
    NotFound: {
        rootChunkID: 3,
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

beforeEach(() => {
    navigator.onLine = true;
    fetch.resetMocks();
    clearLocalStorage('urlResolve');
});

function clearLocalStorage(item) {
    localStorage.setItem(item, null);
}

test('Happy path: resolves w/ rootChunkID and rootModuleID for first matching component found', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT'));
    fetch.mockResponseOnce(JSON.stringify(mockManifest));

    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(res.rootChunkID).toBe(1);
    expect(res.rootModuleID).toBe(99);
});

test('returns NOTFOUND when offline and requested content is not in cache ', async () => {
    navigator.onLine = false;

    fetch.mockResponseOnce(JSON.stringify(mockManifest));
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(res).toHaveProperty(
        'rootChunkID',
        NotFoundManifest.NotFound.rootChunkID
    );
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

    expect(fetch).toHaveBeenCalledTimes(1);
});

test('calls fetchRoute when response is not cached', async () => {
    fetch.mockResponseOnce(urlResolverRes('PRODUCT'));
    fetch.mockResponseOnce(JSON.stringify(mockManifest));
    await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com',
        __tmp_webpack_public_path__: 'https://dev-server.com/pub'
    });

    expect(fetch).toHaveBeenCalledTimes(2);
});
