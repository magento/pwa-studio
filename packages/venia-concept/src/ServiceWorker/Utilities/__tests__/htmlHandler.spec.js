jest.mock('../messageHandler');

import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';

import { cacheHTMLPlugin } from '../htmlHandler';
import { sendMessageToWindow } from '../messageHandler';

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

test('fetchDidSucceed should call sendMessageToWindow if the response is different from what is in the cache', async () => {
    /**
     * Collecting functions on prototype to restore after tests are done.
     */
    const originalText = global.Response.prototype.text;
    const originalClone = global.Response.prototype.clone;

    /**
     * Mocking Request to return different value when .text is called.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve(
            `Hey I am random text ${Math.random()
                .toString()
                .slice(2)}`
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

    /**
     * Restoring prototype function definitions
     */
    global.Response.prototype.text = originalText;
    global.Response.prototype.clone = originalClone;
});

test('fetchDidSucceed should not call sendMessageToWindow if the response if same as that in the cache', async () => {
    /**
     * Collecting functions on prototype to restore after tests are done.
     */
    const originalText = global.Response.prototype.text;
    const originalClone = global.Response.prototype.clone;

    /**
     * Mocking Request to return same value when .text is called.
     */
    global.Response.prototype.text = function() {
        return Promise.resolve('Hey I am same text');
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

    /**
     * Restoring prototype function definitions
     */
    global.Response.prototype.text = originalText;
    global.Response.prototype.clone = originalClone;
});
