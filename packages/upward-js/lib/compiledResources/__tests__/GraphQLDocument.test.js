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
    await expect(doc.render()).resolves.toMatchInlineSnapshot(`
Object {
  "definitions": Array [
    Object {
      "directives": Array [],
      "kind": "OperationDefinition",
      "name": undefined,
      "operation": "query",
      "selectionSet": Object {
        "kind": "SelectionSet",
        "selections": Array [
          Object {
            "alias": undefined,
            "arguments": Array [
              Object {
                "kind": "Argument",
                "name": Object {
                  "kind": "Name",
                  "value": "bar",
                },
                "value": Object {
                  "kind": "IntValue",
                  "value": "1",
                },
              },
            ],
            "directives": Array [],
            "kind": "Field",
            "name": Object {
              "kind": "Name",
              "value": "foos",
            },
            "selectionSet": Object {
              "kind": "SelectionSet",
              "selections": Array [
                Object {
                  "alias": undefined,
                  "arguments": Array [],
                  "directives": Array [],
                  "kind": "Field",
                  "name": Object {
                    "kind": "Name",
                    "value": "mahna",
                  },
                  "selectionSet": undefined,
                },
              ],
            },
          },
        ],
      },
      "variableDefinitions": Array [],
    },
  ],
  "kind": "Document",
  "loc": Object {
    "end": 112,
    "start": 0,
  },
}
`);
});

test('fails on illegal graphql documents', async () => {
    const compiler = new GraphQLDocument(`
         # missing open curly
                foos(bar: 1) {
                    mahna
                }
            }
        `);
    await expect(compiler.compile()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Syntax Error: Unexpected Name \\"foos\\""`
    );
});
