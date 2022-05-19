import M2ApiRequest, { request } from '../M2ApiRequest';

const mockFetch = jest.fn();
const responseJson = req => req.getResponse().then(res => res.json());
M2ApiRequest.prototype._transport = mockFetch;

function mockFetchReturned({
    status = 200,
    statusText = 'OK',
    text,
    json,
    delay = 0
}) {
    mockFetch.mockImplementationOnce(
        (_, { signal }) =>
            new Promise((resolve, reject) => {
                const body = json
                    ? JSON.stringify(typeof json === 'function' ? json() : json)
                    : typeof text === 'function'
                    ? text()
                    : text;
                const timeout = setTimeout(
                    () =>
                        resolve(
                            new Response(body, {
                                status,
                                statusText
                            })
                        ),
                    delay
                );
                signal.onabort = () => {
                    clearTimeout(timeout);
                    const e = new Error('Aborted');
                    e.name = 'AbortError';
                    reject(e);
                };
            })
    );
}
function mockFetchRejected(e, { delay = 0 } = {}) {
    mockFetch.mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(e), delay))
    );
}

afterEach(() => {
    mockFetch.mockReset();
});

test('runs fetch and returns a promise for response object', async () => {
    mockFetchReturned({
        json: {
            some: 'data'
        }
    });
    const req = new M2ApiRequest('fake-path');
    req.run();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
        'fake-path',
        expect.objectContaining({
            headers: expect.any(Headers),
            credentials: 'include',
            signal: expect.any(AbortSignal)
        })
    );
    await expect(responseJson(req)).resolves.toEqual({
        some: 'data'
    });
});

test('returns a rejected promise when http response is not 2xx', async () => {
    mockFetchReturned({
        status: 500,
        statusText: 'Server Yuck',
        text: JSON.stringify({
            error: {
                message: 'That sucked',
                stack: 'php\nstack\ntrace'
            }
        })
    });
    const req = new M2ApiRequest('fake-path');
    req.run();
    await expect(req.getResponse()).rejects.toThrowError(
        'GET fake-path responded 500 Server Yuck'
    );
});

test('throws an error if .run() has not been called', () => {
    const req = new M2ApiRequest('somewhere');
    expect(() => req.getResponse()).toThrowErrorMatchingSnapshot();
});

test('throws an error if underlying transport throws an error', async () => {
    mockFetchRejected(new Error('Something weird happened'));
    const req = new M2ApiRequest('somewhere');
    req.run();
    await expect(req.getResponse()).rejects.toThrow('Something weird happened');
});

test('can be aborted', async () => {
    mockFetchReturned({
        json: 'never gets to you',
        delay: 500
    });
    const req = new M2ApiRequest('somewhere', {
        method: 'POST',
        body: 'something'
    });
    req.run();
    req.abortRequest();
    await expect(req.getResponse()).rejects.toThrowErrorMatchingSnapshot();
});

test('multicasts a request that appears safe and idempotent', async () => {
    jest.useFakeTimers();
    const uniqueId = Math.random().toString(16);
    mockFetchReturned({
        json: uniqueId,
        delay: 1000
    });
    const req = new M2ApiRequest('some-empty-post', {
        method: 'POST'
    });
    req.run();
    const subsequentReq = new M2ApiRequest('some-empty-post', {
        method: 'POST'
    });
    subsequentReq.run();
    jest.runAllTimers();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const result = await responseJson(req);
    expect(result).toEqual(uniqueId);
    expect(result).toEqual(await responseJson(subsequentReq));
    jest.useRealTimers();
});

test('does not multicast a settled request', async () => {
    jest.useFakeTimers();
    mockFetchReturned({
        json: 'response1',
        delay: 100
    });
    mockFetchReturned({
        json: 'response2',
        delay: 1000
    });
    const req = new M2ApiRequest('some-cacheable-operation');
    req.run();
    jest.advanceTimersByTime(500);
    expect(await responseJson(req)).toEqual('response1');
    const subsequentReq = new M2ApiRequest('some-cacheable-operation');
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    jest.runAllTimers();
    expect(await responseJson(subsequentReq)).toEqual('response2');
    jest.useRealTimers();
});

test('does not multicast a request that is clearly not idempotent/safe', async () => {
    jest.useFakeTimers();
    mockFetchReturned({
        json: 'response1',
        delay: 1000
    });
    mockFetchReturned({
        json: 'response2',
        delay: 200
    });
    const req = new M2ApiRequest('some-create-operation', {
        method: 'POST',
        body: 'do stuff'
    });
    req.run();
    const subsequentReq = new M2ApiRequest('some-create-operation', {
        method: 'POST',
        body: 'do stuff'
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(500);
    expect(await responseJson(subsequentReq)).toEqual('response2');
    jest.runAllTimers();
    expect(await responseJson(req)).toEqual('response1');
    jest.useRealTimers();
});

test('multicasts an unsafe request if `multicast` option is true', async () => {
    jest.useFakeTimers();
    mockFetchReturned({
        json: 'response1',
        delay: 1000
    });
    mockFetchReturned({
        json: 'response2',
        delay: 200
    });
    const req = new M2ApiRequest('some-create-operation', {
        method: 'POST',
        body: 'do stuff',
        multicast: true
    });
    req.run();
    const subsequentReq = new M2ApiRequest('some-create-operation', {
        method: 'POST',
        body: 'do stuff',
        multicast: true
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // observe that the second mock was set to resolve faster, but multicast
    // reuses the first mock
    let subsequentReqResolved = false;
    subsequentReq.getResponse().then(() => {
        subsequentReqResolved = true;
    });
    jest.advanceTimersByTime(500);
    expect(subsequentReqResolved).toBe(false);
    jest.runAllTimers();
    expect(await responseJson(req)).toEqual('response1');
    expect(await responseJson(subsequentReq)).toEqual('response1');
    expect(subsequentReqResolved).toBe(true);
    jest.useRealTimers();
});

test('does not multicast a safe request if `multicast` option is false', async () => {
    mockFetchReturned({
        json: 'updated1'
    });
    mockFetchReturned({
        json: 'updated2'
    });
    const req = new M2ApiRequest('resource-to-update', {
        method: 'PUT',
        body: 'new value',
        multicast: false
    });
    req.run();
    const subsequentReq = new M2ApiRequest('resource-to-update', {
        method: 'PUT',
        body: 'new value',
        multicast: false
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(await responseJson(req)).toEqual('updated1');
    expect(await responseJson(subsequentReq)).toEqual('updated2');
});

test('if cache is set to reload or no-store, aborts and replaces a matching multicast', async () => {
    mockFetchReturned({
        json: {
            shouldBeOverridden: true
        },
        delay: 50
    });
    mockFetchReturned({
        json: {
            shouldOverride: true
        },
        delay: 100
    });
    const req = new M2ApiRequest('slow-resource');
    req.run();
    const rolls = new M2ApiRequest('slow-resource', {
        cache: 'no-store'
    });
    rolls.run();
    await expect(responseJson(rolls)).resolves.toHaveProperty('shouldOverride');
    await expect(responseJson(req)).resolves.toHaveProperty('shouldOverride');
});

test('multicasts can be manually aborted', async () => {
    mockFetchReturned({
        json: 'never gets to you',
        delay: 500
    });
    const req = new M2ApiRequest('somewhere');
    req.run();
    req.abortRequest();
    await expect(responseJson(req)).rejects.toThrowErrorMatchingSnapshot();
});

test('headers can be updated with object literal', async () => {
    mockFetchReturned({
        json: {
            some: 'otherdata'
        }
    });
    await expect(
        request('somewhere', {
            cache: 'reload',
            headers: {
                'If-Modified-Since': new Date().toISOString()
            }
        })
    ).resolves.toEqual({
        some: 'otherdata'
    });
});

test('headers can be updated with Header instance', async () => {
    mockFetchReturned({
        json: {
            some: 'otherdata'
        }
    });
    await expect(
        request('somewhere', {
            cache: 'reload',
            headers: new Headers({
                Accept: 'text/plain'
            })
        })
    ).resolves.toEqual({
        some: 'otherdata'
    });
});

test('convenience method creates, runs, and promises a request', async () => {
    mockFetchReturned({
        json: {
            some: 'otherdata'
        }
    });
    await expect(request('somewhere', { cache: 'reload' })).resolves.toEqual({
        some: 'otherdata'
    });
});

test('convenience method returns a response if parseJSON is false', async () => {
    mockFetchReturned({
        json: {
            some: 'otherdata'
        }
    });
    const response = await request('somewhere', { parseJSON: false });
    expect(response).toBeInstanceOf(Response);
    await expect(response.json()).resolves.toEqual({
        some: 'otherdata'
    });
});
