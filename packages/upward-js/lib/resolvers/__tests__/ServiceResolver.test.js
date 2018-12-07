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

    const [fetchUri, fetchOptions] = visitor.io.networkFetch.mock.calls[0];

    expect(fetchUri).toBe('https://example.com/graphql');

    expect(JSON.parse(fetchOptions.body)).toMatchObject({
        operationName: null,
        query: `{
  foo {
    bar
  }
}
`,
        variables: {}
    });
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

    const [fetchUri, fetchOptions] = visitor.io.networkFetch.mock.calls[0];

    expect(fetchUri).toMatch('https://example.com/graphql?query');

    expect(fetchOptions.method).toBe('GET');
});

test('places a server call with variables', async () => {
    const res = { data: { foo: { bar: 'nothing' } } };
    const visitor = {
        upward: jest.fn(
            (dfn, name) =>
                ({
                    theUrl: 'https://example.com/graphql',
                    theQuery:
                        'query getFoo($id: String!) { foo(id: $id) { bar } }',
                    'combination.to.my.luggage': {
                        id: 12345
                    }
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
            variables: 'combination.to.my.luggage'
        })
    ).resolves.toEqual(res);

    const fetchOptions = visitor.io.networkFetch.mock.calls[0][1];

    expect(JSON.parse(fetchOptions.body)).toMatchObject({
        operationName: 'getFoo',
        query: `query getFoo($id: String!) {
  foo(id: $id) {
    bar
  }
}
`,
        variables: {
            id: 12345
        }
    });
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        },
        upward: jest.fn(async () => 'bleh')
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            variables: {
                inline: 'bleh'
            }
        })
    ).rejects.toThrow('Variables must resolve to a plain object.');
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = {
        io: {
            networkFetch: jest.fn(async () => ({
                json: async () => res,
                text: async () => JSON.stringify(res)
            }))
        },
        upward: jest.fn(async () => 'bleh')
    };

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery',
            variables: 'combination.to.my.luggage'
        })
    ).rejects.toThrow('Variables must resolve to a plain object.');
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
