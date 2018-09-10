const fetch = require('node-fetch');
const ServiceResolver = require('../ServiceResolver');
const GraphQLDocument = require('../../compiledResources/GraphQLDocument');

test('resolverType is file', () =>
    expect(ServiceResolver.resolverType).toBe('service'));

test('telltale exists', () => expect(ServiceResolver.telltale).toBeDefined());

test('places a server call and returns results', async () => {
    const res = { data: { foo: { bar: 'exam' } } };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theQuery: '{ foo { bar } }'
                }[dfn[name]])
        ),
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery'
        })
    ).resolves.toEqual(res);

    expect(visitor.io.networkFetch).toHaveBeenCalledWith(
        'https://example.com/graphql',
        expect.objectContaining({
            body: expect.stringMatching('"query":')
        })
    );
});

test('places a server call with custom method and headers', async () => {
    const res = { data: { foo: { bar: 'exam' } } };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theHeaders: { Authorization: 'Bear OMG' },
                    theMethod: 'GET',
                    theQuery: '{ foo { bar } }'
                }[dfn[name]])
        ),
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            headers: 'theHeaders',
            method: 'theMethod'
        })
    ).resolves.toEqual(res);

    expect(visitor.io.networkFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://example.com/graphql?query'),
        expect.objectContaining({
            method: 'GET'
        })
    );
});

test('places a server call with variables', async () => {
    const res = { data: { foo: { bar: 'nothing' } } };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theQuery:
                        'query getFoo($id: String!) { foo(id: $id) { bar } }'
                }[dfn[name]])
        ),
        context: {
            get: jest.fn(() => '12345')
        },
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            variables: {
                id: 'combination.to.my.luggage'
            }
        })
    ).resolves.toEqual(res);

    expect(visitor.io.networkFetch).toHaveBeenCalledWith(
        'https://example.com/graphql',
        expect.objectContaining({
            body: expect.stringMatching('12345')
        })
    );
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            variables: 'combination.to.my.luggage'
        })
    ).rejects.toThrow('Variables must be a simple object');
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            variables: 'combination.to.my.luggage'
        })
    ).rejects.toThrow('Variables must be a simple object');
});

test('throws if query is missing', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl'
        })
    ).rejects.toThrow('No GraphQL query');
});

test('throws if url is missing', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            query: 'theQuery'
        })
    ).rejects.toThrow('No URL');
});

test('accepts a precompiled GraphQLDocument', async () => {
    const res = { data: { foo: { bar: 'exam' } } };
    const gqlDoc = new GraphQLDocument('{ foo { bar } }');
    await gqlDoc.compile();
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theQuery: gqlDoc
                }[dfn[name]])
        ),
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery'
        })
    ).resolves.toEqual(res);
});

test('throws if the query is neither a string nor a GraphQLDocument', async () => {
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theQuery: {}
                }[dfn[name]])
        ),
        io: {
            networkFetch: jest.fn()
        }
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery'
        })
    ).rejects.toThrowError('Unknown type');
});
