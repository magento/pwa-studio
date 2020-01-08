jest.mock('../messageHandler');

import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';

import { cacheHTMLPlugin } from '../htmlHandler';
import { sendMessageToWindow } from '../messageHandler';

const matchFn = jest.fn();
let originalText = null;
let originalClone = null;

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

beforeEach(() => {
    /**
     * Collecting functions on prototype to restore after tests are done.
     */
    originalText = global.Response.prototype.text;
    originalClone = global.Response.prototype.clone;
});

afterEach(() => {
    /**
     * Restoring prototype function definitions
     */
    global.Response.prototype.text = originalText;
    global.Response.prototype.clone = originalClone;
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

    expect(response.url).toBe('/');
});

test('fetchDidSucceed should return the same response object given to it in params', async () => {
    const request = new Request('https://develop.pwa-venia.com/');
    const response = new Response();

    const returnedResponse = await cacheHTMLPlugin.fetchDidSucceed({
        request,
        response
    });

    expect(returnedResponse).toBe(response);
});

test('fetchDidSucceed should not call sendMessageToWindow if the cache does not have a response for the url', async () => {
    const request = new Request('https://develop.pwa-venia.com/');
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({
        request,
        response
    });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if the response has a different title from what is in the cache', async () => {
    /**
     * Mocking Request to return different value for the tag
     * when .textis  called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html><title>Title - ${Math.random()
                .toString()
                .slice(2)}</title></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalledTimes(1);
    expect(sendMessageToWindow).toHaveBeenCalledWith(HTML_UPDATE_AVAILABLE);
});

test('fetchDidSucceed should not call sendMessageToWindow if the response has same title as that in the cache', async () => {
    /**
     * Mocking Request to return same value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve('<html><title>Same Title</title></html>');
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test("fetchDidSucceed should call sendMessageToWindow if one or more script tag's src has changed", async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html><script src="www.adobe.com/analytics_script_${Math.random()
                .toString()
                .slice(2)}"></script></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test("fetchDidSucceed should not call sendMessageToWindow if script tag's src has not changed even though the wrapped JS has changed", async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html><script src="www.adobe.com/analytics_script_v1"></script><script>var x = ${Math.random()
                .toString()
                .slice(2)}"</script></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test("fetchDidSucceed should call sendMessageToWindow if one or more link's href has changed", async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html><link href="www.adobe.com/spectrumCss_v${Math.random()
                .toString()
                .slice(2)}.css"></link></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test("fetchDidSucceed should not call sendMessageToWindow if link's href has not changed", async () => {
    /**
     * Mocking Request to return same value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            '<html><link href="www.adobe.com/spectrumCss.css"></link></html>'
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if one or more styles have changed', async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html><style>@font-face {
                font-weight: ${Math.random()
                    .toString()
                    .slice(2)};
            }</style></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test('fetchDidSucceed should not call sendMessageToWindow if styles have not changed', async () => {
    /**
     * Mocking Request to return same value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            '<html><style>@font-face {font-weight: 300;}</style></html>'
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if data-media-backend attribute in the html tag has changed', async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html data-media-backend=www.magento-cloud.com/instance_${Math.random()
                .toString()
                .slice(2)}></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test('fetchDidSucceed should not call sendMessageToWindow if data-media-backend attribute in the html tag has not changed', async () => {
    /**
     * Mocking Request to return same value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            '<html data-media-backend=www.magento-cloud.com/instance_01></html>'
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if data-image-optimizing-origin attribute in the html tag has changed', async () => {
    /**
     * Mocking Request to return a different value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `<html data-image-optimizing-origin=source_${Math.random()
                .toString()
                .slice(2)}></html>`
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test('fetchDidSucceed should not call sendMessageToWindow if data-image-optimizing-origin attribute in the html tag has not changed', async () => {
    /**
     * Mocking Request to return same value for
     * the tag when .text is called on the response.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            '<html data-image-optimizing-origin=source_01></html>'
        );
    };
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).not.toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if a resouce has been added', async () => {
    /**
     * Mocking Request to return different values first 2 times.
     * Adds a resource second time to mock a resource addition.
     */
    global.Response.prototype.text = jest
        .fn()
        .mockReturnValueOnce(
            Promise.resolve(
                '<html><link href="www.adobe.com/spectrumCss.css"></link></html>'
            )
        )
        .mockReturnValueOnce(
            Promise.resolve(
                '<html><link href="www.adobe.com/spectrumCss_v0.css"></link><link href="www.adobe.com/spectrumCss_v1.css"></link></html>'
            )
        )
        .mockReturnValue(
            Promise.resolve(
                '<html><link href="www.adobe.com/spectrumCss.css"></link></html>'
            )
        );
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});

test('fetchDidSucceed should call sendMessageToWindow if a resouce has been removed', async () => {
    /**
     * Mocking Request to return different values first 2 times.
     * Removes a resource second time to mock a resource removal.
     */
    global.Response.prototype.text = jest
        .fn()
        .mockReturnValueOnce(
            Promise.resolve(
                '<html><link href="www.adobe.com/spectrumCss_v0.css"></link><link href="www.adobe.com/spectrumCss_v1.css"></link></html>'
            )
        )
        .mockReturnValue(
            Promise.resolve(
                '<html><link href="www.adobe.com/spectrumCss.css"></link></html>'
            )
        );
    global.Response.prototype.clone = function() {
        return new Response();
    };

    /**
     * Mocking cache to have a response for 'https://develop.pwa-venia.com/'
     */
    matchFn.mockReturnValue(Promise.resolve(new Response()));

    const url = 'https://develop.pwa-venia.com/';
    const request = new Request(url);
    const response = new Response();

    await cacheHTMLPlugin.fetchDidSucceed({ request, response });

    expect(sendMessageToWindow).toHaveBeenCalled();
});
