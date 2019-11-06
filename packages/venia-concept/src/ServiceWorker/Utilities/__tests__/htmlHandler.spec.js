jest.mock('../messageHandler');

import { cacheHTMLPlugin } from '../htmlHandler';

const matchFn = jest.fn();

beforeAll(() => {
    global.caches = {
        match: matchFn
    };
    global.Request = function(url, { method, headers } = {}) {
        this.url = url;
        this.method = method;
        this.headers = headers;
    };
    global.Response = function() {};
});

test('cacheHTMLPlugin should have cacheKeyWillBeUsed, requestWillFetch, fetchDidSucceed async functions implemented', () => {
    matchFn.mockReturnValue(Promise.resolve(null));

    expect(cacheHTMLPlugin).toHaveProperty('cacheKeyWillBeUsed');
    expect(cacheHTMLPlugin).toHaveProperty('requestWillFetch');
    expect(cacheHTMLPlugin).toHaveProperty('fetchDidSucceed');

    expect(cacheHTMLPlugin.cacheKeyWillBeUsed).toBeInstanceOf(Function);
    expect(cacheHTMLPlugin.requestWillFetch).toBeInstanceOf(Function);
    expect(cacheHTMLPlugin.fetchDidSucceed).toBeInstanceOf(Function);

    expect(cacheHTMLPlugin.cacheKeyWillBeUsed()).toBeInstanceOf(Promise);
    expect(
        cacheHTMLPlugin.requestWillFetch({
            request: new Request('https://develop.pwa-venia.com/')
        })
    ).toBeInstanceOf(Promise);
    expect(
        cacheHTMLPlugin.fetchDidSucceed({
            request: new Request('https://develop.pwa-venia.com/'),
            response: new Response()
        })
    ).toBeInstanceOf(Promise);
});

test('cacheKeyWillBeUsed function should return a promise that resolves to /', async () => {
    const response = await cacheHTMLPlugin.cacheKeyWillBeUsed();

    expect(response).toBe('/');
});

test('requestWillFetch should return a new Request with url set to /', async () => {
    const request = new Request('https://develop.pwa-venia.com/');
    const response = await cacheHTMLPlugin.requestWillFetch({ request });

    expect(response.url).not.toBe(request.url);
});
