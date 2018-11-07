import resolveUnknownRoute from '../resolveUnknownRoute';

const urlResolverRes = (type, id) =>
    JSON.stringify({
        data: {
            urlResolver: { type, id }
        }
    });

beforeEach(() => {
    document.body.innerHTML = '';
    resolveUnknownRoute.preloadDone = false;
    fetch.resetMocks();
});

test('Preload path: resolves directly from preload element', async () => {
    document.body.innerHTML =
        '<script type="application/json" id="url-resolver">{ "type": "PRODUCT", "id": "VA-123" }</script>';
    const res = await resolveUnknownRoute({
        route: 'foo-bar.html',
        apiBase: 'https://store.com'
    });
    expect(res).toMatchObject({
        type: 'PRODUCT',
        id: 'VA-123'
    });
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
