const GraphQLDocument = require('../GraphQLDocument');
const AbstractCompiledResource = require('../AbstractCompiledResource');

test('extends AbstractCompiledResource concretely', () => {
    const instantiate = () => new GraphQLDocument('', {});
    expect(instantiate).not.toThrow();
    expect(instantiate()).toBeInstanceOf(AbstractCompiledResource);
});

test('supported extensions include standard .graphql', () => {
    expect(GraphQLDocument.supportedExtensions).toContain('.graphql');
});

test('compiles GraphQL documents', async () => {
    const doc = new GraphQLDocument(`
            {
                foos(bar: 1) {
                    mahna
                }
            }
        `);
    await expect(doc.compile()).resolves.not.toThrow();
    await expect(doc.render()).resolves.toMatchObject({
        kind: 'Document',
        definitions: [
            {
                kind: 'OperationDefinition',
                operation: 'query',
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                        {
                            kind: 'Field',
                            name: {
                                kind: 'Name',
                                value: 'foos'
                            },
                            arguments: [
                                {
                                    kind: 'Argument',
                                    name: {
                                        kind: 'Name',
                                        value: 'bar'
                                    },
                                    value: {
                                        kind: 'IntValue',
                                        value: '1'
                                    }
                                }
                            ],
                            directives: [],
                            selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                    {
                                        kind: 'Field',
                                        name: {
                                            kind: 'Name',
                                            value: 'mahna'
                                        },
                                        arguments: [],
                                        directives: []
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ],
        loc: {
            end: 112,
            start: 0
        }
    });
});

test('fails on illegal graphql documents', async () => {
    const compiler = new GraphQLDocument(`
         # missing open curly
                foos(bar: 1) {
                    mahna
                }
            }
        `);
    await expect(compiler.compile()).rejects.toThrow('Syntax Error');
});
