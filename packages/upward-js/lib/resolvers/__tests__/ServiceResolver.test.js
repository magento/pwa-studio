const ServiceResolver = require('../ServiceResolver');
const GraphQLDocument = require('../../compiledResources/GraphQLDocument');

const mockVisitor = ({ defs, res }) => ({
    upward: jest.fn((dfn, name) => defs[dfn[name]]),
    io: {
        networkFetch: jest.fn(async () => ({
            json: async () => res,
            text: async () => JSON.stringify(res)
        }))
    }
});

const nullVisitor = {};

test('resolverType is service', () =>
    expect(ServiceResolver.resolverType).toBe('service'));

test('telltale exists', () => expect(ServiceResolver.telltale).toBeDefined());

test('.recognize identifies and returns a valid configuration', () => {
    expect(
        ServiceResolver.recognize({
            url: 'https://sub.example.com/gql',
            query: 'query placeholder',
            variables: {
                some: 'variable'
            }
        })
    ).toEqual({
        endpoint: 'https://sub.example.com/gql',
        query: 'query placeholder',
        variables: {
            some: 'variable'
        }
    });
    expect(
        ServiceResolver.recognize({
            inline: 'gluh'
        })
    ).not.toBeDefined();
});

test('places a server call and returns results', async () => {
    const defs = {
        theEndpoint: 'https://example.com/graphql',
        theQuery: '{ foo { bar } }'
    };
    const res = { data: { foo: { bar: 'exam' } } };
    const visitor = mockVisitor({
        defs,
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theEndpoint',
            query: 'theQuery'
        })
    ).resolves.toEqual(res);

    const [fetchUri, fetchOptions] = visitor.io.networkFetch.mock.calls[0];

    expect(fetchUri).toBe(defs.theEndpoint);

    expect(JSON.parse(fetchOptions.body)).toMatchObject({
        query: `{\n  foo {\n    bar\n  }\n}\n`,
        variables: {}
    });
});

test('recognizes deprecated "url" parameter', async () => {
    const defs = {
        theUrl: 'https://example.com/graphql',
        theQuery: '{ foo { bar } }'
    };
    const res = { data: { foo: { bar: 'exam' } } };
    const visitor = mockVisitor({
        defs,
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            url: 'theUrl',
            query: 'theQuery'
        })
    ).resolves.toEqual(res);

    const [fetchUri, fetchOptions] = visitor.io.networkFetch.mock.calls[0];

    expect(fetchUri).toBe(defs.theUrl);

    expect(JSON.parse(fetchOptions.body)).toMatchObject({
        query: `{\n  foo {\n    bar\n  }\n}\n`,
        variables: {}
    });
});

test('places a server call with custom method and headers', async () => {
    const res = { data: { foo: { bar: 'exam' } } };
    const visitor = mockVisitor({
        defs: {
            theUrl: 'https://example.com/graphql',
            theHeaders: { Authorization: 'Bear OMG' },
            theMethod: 'GET',
            theQuery: '{ foo { bar } }'
        },
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
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
    const visitor = mockVisitor({
        defs: {
            theUrl: 'https://example.com/graphql',
            theQuery: 'query getFoo($id: String!) { foo(id: $id) { bar } }',
            'combination.to.my.luggage': {
                id: 12345
            }
        },
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
            query: 'theQuery',
            variables: 'combination.to.my.luggage'
        })
    ).resolves.toEqual(res);

    const fetchOptions = visitor.io.networkFetch.mock.calls[0][1];

    expect(JSON.parse(fetchOptions.body)).toMatchObject({
        operationName: 'getFoo',
        query: `query getFoo($id: String!) {\n  foo(id: $id) {\n    bar\n  }\n}\n`,
        variables: {
            id: 12345
        }
    });
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = mockVisitor({
        defs: {
            theUrl: 'https://example.com',
            theQuery: '{ foo { bar } }',
            bleh: 'bleh'
        }
    });
    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
            query: 'theQuery',
            variables: 'bleh'
        })
    ).rejects.toThrow('Variables must resolve to a plain object.');
});

test('throws if variables are in an unacceptable format', async () => {
    const visitor = mockVisitor({
        defs: {
            'combination.to.my.luggage': 12345
        }
    });
    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
            query: 'theQuery',
            variables: 'combination.to.my.luggage'
        })
    ).rejects.toThrow('Variables must resolve to a plain object.');
});

test('throws if query is missing', async () => {
    await expect(
        new ServiceResolver(nullVisitor).resolve({
            endpoint: 'theUrl'
        })
    ).rejects.toThrow('No GraphQL query');
});

test('throws if url and endpoint are missing', async () => {
    await expect(
        new ServiceResolver(nullVisitor).resolve({
            query: 'theQuery'
        })
    ).rejects.toThrow('No endpoint');
});

test('throws if url and endpoint are missing', async () => {
    await expect(
        new ServiceResolver(nullVisitor).resolve({
            query: 'theQuery'
        })
    ).rejects.toThrow('No endpoint');
});

test('throws if url and endpoint are both present', async () => {
    await expect(
        new ServiceResolver(nullVisitor).resolve({
            query: 'theQuery',
            url: 'someUrl',
            endpoint: 'someEndpoint'
        })
    ).rejects.toThrow('Cannot specify both');
});

test('accepts a precompiled GraphQLDocument', async () => {
    const res = { data: { foo: { bar: 'exam' } } };
    const gqlDoc = new GraphQLDocument('{ foo { bar } }');
    await gqlDoc.compile();
    const visitor = mockVisitor({
        defs: {
            theUrl: 'https://example.com/graphql',
            theQuery: gqlDoc
        },
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
            query: 'theQuery'
        })
    ).resolves.toEqual(res);
});

test('throws if the query is neither a string nor a GraphQLDocument', async () => {
    const visitor = mockVisitor({
        defs: {
            theUrl: 'https://example.com/graphql',
            theQuery: {}
        }
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theUrl',
            query: 'theQuery'
        })
    ).rejects.toThrowError('Unknown type');
});

test('throws if GraphQL query returns errors', async () => {
    const defs = {
        theEndpoint: 'https://example.com/graphql',
        theQuery: '{ foo { bar } }'
    };
    const res = {
        errors: [
            {
                message: 'A terrible error occurred.'
            },
            {
                message: 'Another terrible error occurred.'
            }
        ]
    };
    const visitor = mockVisitor({
        defs,
        res
    });

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theEndpoint',
            query: 'theQuery'
        })
    ).rejects.toThrow('A terrible error occurred');
});

test('throws if GraphQL request throws', async () => {
    const defs = {
        theEndpoint: '/path/to/graphql',
        theQuery: '{ foo { bar } }'
    };
    const visitor = mockVisitor({
        defs
    });

    visitor.io.networkFetch = () => Promise.reject('The worst');

    await expect(
        new ServiceResolver(visitor).resolve({
            endpoint: 'theEndpoint',
            query: 'theQuery'
        })
    ).rejects.toThrow('The worst');
});
