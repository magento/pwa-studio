import M2ApiRequest, { request } from '../M2ApiRequest';

const mockFetch = jest.fn();
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
                const timeout = setTimeout(
                    () =>
                        resolve({
                            status,
                            statusText,
                            ok: status >= 200 && status < 300,
                            text:
                                typeof text === 'function'
                                    ? text
                                    : async () => text,
                            json:
                                typeof json === 'function'
                                    ? json
                                    : async () => json
                        }),
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
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'fake-path'
    });
    req.run();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/^\/.*fake\-path/),
        expect.objectContaining({
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json'
            },
            method: 'GET',
            credentials: 'include',
            signal: expect.any(AbortSignal)
        })
    );
    await expect(req.getPromise()).resolves.toEqual({
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
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'fake-path'
    });
    req.run();
    await expect(req.getPromise()).rejects.toThrowError(
        'GET fake-path responded 500 Server Yuck'
    );
});

test('throws an error if .run() has not been called', () => {
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'somewhere'
    });
    expect(() => req.getPromise()).toThrowErrorMatchingSnapshot();
});

test('throws an error if underlying transport throws an error', async () => {
    mockFetchRejected(new Error('Something weird happened'));
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'somewhere'
    });
    req.run();
    await expect(req.getPromise()).rejects.toThrow('Something weird happened');
});

test('catches and handles weird .text errors in response', async () => {
    mockFetchReturned({
        status: 404,
        statusText: 'Not Found',
        async text() {
            throw Error('It was so hard to print text');
        }
    });
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'somewhere'
    });
    req.run();
    await expect(req.getPromise()).rejects.toThrow(
        'It was so hard to print text'
    );
});

test('can add interrupts that run before outer promise resolved', async () => {
    mockFetchReturned({
        json: 'whee'
    });
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'somewhere',
        body: 'something'
    });
    req.run();
    const handler = jest.fn();
    req.addInterrupt(handler);
    await req.getPromise().then(handler);
    expect(handler).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        'resolved',
        req
    );
    expect(handler).toHaveBeenNthCalledWith(2, 'whee');
});

test('interrupts also run if promise rejects unexpectedly', async () => {
    mockFetchRejected(new Error('Something weird happened'));
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'somewhere'
    });
    req.run();
    const handler = jest.fn(() => 'it threw');
    req.addInterrupt(handler);
    await expect(req.getPromise().catch(handler)).resolves.toEqual('it threw');
    expect(handler).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        'rejected',
        req
    );
});

test('interrupts also run if request fails', async () => {
    mockFetchReturned({
        status: 400,
        statusText: 'Bad Request',
        text: ''
    });
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'somewhere',
        body: 'something'
    });
    req.run();
    const handler = jest.fn();
    req.addInterrupt(handler);
    await req.getPromise().catch(handler);
    expect(handler).toHaveBeenNthCalledWith(2, expect.any(Error));
    expect(handler).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        'rejected',
        req
    );
});

test('can be aborted', async () => {
    mockFetchReturned({
        json: 'never gets to you',
        delay: 500
    });
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'somewhere',
        body: 'something'
    });
    req.run();
    req.abortRequest();
    await expect(req.getPromise()).rejects.toThrowErrorMatchingSnapshot();
});

test('multicasts a request that appears safe and idempotent', async () => {
    jest.useFakeTimers();
    const uniqueId = Math.random().toString(16);
    mockFetchReturned({
        json: uniqueId,
        delay: 1000
    });
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'some-empty-post'
    });
    req.run();
    const subsequentReq = new M2ApiRequest({
        method: 'POST',
        path: 'some-empty-post'
    });
    subsequentReq.run();
    jest.runAllTimers();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const result = await req.getPromise();
    expect(result).toEqual(uniqueId);
    expect(result).toEqual(await subsequentReq.getPromise());
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
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'some-cacheable-operation'
    });
    req.run();
    jest.advanceTimersByTime(500);
    expect(await req.getPromise()).toEqual('response1');
    const subsequentReq = new M2ApiRequest({
        method: 'GET',
        path: 'some-cacheable-operation'
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    jest.runAllTimers();
    expect(await subsequentReq.getPromise()).toEqual('response2');
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
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'some-create-operation',
        body: 'do stuff'
    });
    req.run();
    const subsequentReq = new M2ApiRequest({
        method: 'POST',
        path: 'some-create-operation',
        body: 'do stuff'
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(500);
    expect(await subsequentReq.getPromise()).toEqual('response2');
    jest.runAllTimers();
    expect(await req.getPromise()).toEqual('response1');
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
    const req = new M2ApiRequest({
        method: 'POST',
        path: 'some-create-operation',
        body: 'do stuff',
        multicast: true
    });
    req.run();
    const subsequentReq = new M2ApiRequest({
        method: 'POST',
        path: 'some-create-operation',
        body: 'do stuff',
        multicast: true
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // observe that the second mock was set to resolve faster, but multicast
    // reuses the first mock
    let subsequentReqResolved = false;
    subsequentReq.getPromise().then(() => {
        subsequentReqResolved = true;
    });
    jest.advanceTimersByTime(500);
    expect(subsequentReqResolved).toBe(false);
    jest.runAllTimers();
    expect(await req.getPromise()).toEqual('response1');
    expect(await subsequentReq.getPromise()).toEqual('response1');
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
    const req = new M2ApiRequest({
        method: 'PUT',
        path: 'resource-to-update',
        body: 'new value',
        multicast: false
    });
    req.run();
    const subsequentReq = new M2ApiRequest({
        method: 'PUT',
        path: 'resource-to-update',
        body: 'new value',
        multicast: true
    });
    subsequentReq.run();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(await req.getPromise()).toEqual('updated1');
    expect(await subsequentReq.getPromise()).toEqual('updated2');
});

test('transfers interrupts to the multicasted request', async () => {
    mockFetchReturned({
        json: ''
    });
    const req = new M2ApiRequest({
        method: 'DELETE',
        path: 'doomed'
    });
    const originalInterrupt = jest.fn();
    req.addInterrupt(originalInterrupt);
    const subsequentReq = new M2ApiRequest({
        method: 'DELETE',
        path: 'doomed'
    });
    const subsequentInterrupt = jest.fn();
    subsequentReq.addInterrupt(subsequentInterrupt);
    req.run();
    subsequentReq.run();
    await subsequentReq.getPromise();
    expect(originalInterrupt).toHaveBeenCalledTimes(1);
    expect(originalInterrupt).toHaveBeenCalledWith(
        expect.anything(),
        'resolved',
        req
    );
    expect(subsequentInterrupt).toHaveBeenCalledTimes(1);
    expect(subsequentInterrupt).toHaveBeenCalledWith(
        expect.anything(),
        'resolved',
        req
    );
});

test('if `rolling` is true, aborts and replaces a matching multicast', async () => {
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
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'slow-resource'
    });
    req.run();
    const rolls = new M2ApiRequest({
        method: 'GET',
        path: 'slow-resource',
        rolling: true
    });
    rolls.run();
    await expect(rolls.getPromise()).resolves.toHaveProperty('shouldOverride');
    await expect(req.getPromise()).resolves.toHaveProperty('shouldOverride');
});

test('multicasts can be manually aborted', async () => {
    mockFetchReturned({
        json: 'never gets to you',
        delay: 500
    });
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'somewhere'
    });
    req.run();
    req.abortRequest();
    await expect(req.getPromise()).rejects.toThrowErrorMatchingSnapshot();
});

test('convenience method creates, runs, and promises a request', async () => {
    mockFetchReturned({
        json: {
            some: 'otherdata'
        }
    });

    await expect(
        request({ method: 'GET', path: 'somewhere', rolling: true })
    ).resolves.toEqual({
        some: 'otherdata'
    });
});
