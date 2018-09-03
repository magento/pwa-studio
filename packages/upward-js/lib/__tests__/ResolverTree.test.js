const ResolverTree = require('../ResolverTree');

const mockIO = {
    readFile: jest.fn(),
    resolvePaths: jest.fn(),
    networkFetch: jest.fn()
};

test('instantiates with a simple config', () => {
    expect(
        () =>
            new ResolverTree({
                status: 200,
                headers: {
                    inline: {
                        'content-type': 'text/plain'
                    }
                },
                body: {
                    inline: 'Hello World!'
                }
            })
    ).not.toThrow();
});

test('does not instantiate if config lacks top level response properties', () => {
    expect(
        () =>
            new ResolverTree({
                status: 200,
                body: {
                    inline: 'Hello World!'
                }
            })
    ).toThrow("'headers' must be a defined property at top level!");
    expect(
        () =>
            new ResolverTree({
                headers: {
                    inline: {
                        'content-type': 'text/plain'
                    }
                },
                body: {
                    inline: 'Hello World!'
                }
            })
    ).toThrow("'status' must be a defined property at top level!");
    expect(
        () =>
            new ResolverTree({
                headers: {
                    inline: {
                        'content-type': 'text/plain'
                    }
                }
            })
    ).toThrow("'body' must be a defined property at top level!");
});

test('resolveInvariants(context) on a fully resolvable config produces a static server with no future context deps', async () => {
    const tree = new ResolverTree(
        {
            status: 200,
            headers: {
                inline: {
                    'content-type': 'text/plain'
                }
            },
            body: {
                inline: 'Hello World!'
            }
        },
        mockIO
    );
    expect(await tree.resolveInvariants()).resolves.not.toThrow();
});
