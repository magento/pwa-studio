const JSONObject = require('../JSONObject');
const AbstractCompiledResource = require('../AbstractCompiledResource');

test('extends AbstractCompiledResource concretely', () => {
    const instantiate = () => new JSONObject('');
    expect(instantiate).not.toThrow();
    expect(instantiate()).toBeInstanceOf(AbstractCompiledResource);
});

test('supported extensions include standard .json', () => {
    expect(JSONObject.supportedExtensions).toContain('.json');
});

test('parses and returns JSON', async () => {
    const json = new JSONObject(`
            {
                "data": {
                    "foos": [
                        {
                            "mahna": "mahna"
                        }
                    ]
                }
            }
        `);
    await expect(json.compile()).resolves.not.toThrow();
    await expect(json.render()).resolves.toMatchInlineSnapshot(`
Object {
  "data": Object {
    "foos": Array [
      Object {
        "mahna": "mahna",
      },
    ],
  },
}
`);
});

test('fails on illegal json documents', async () => {
    const json = new JSONObject(`
         // JSON don't got comments!
            {
                "data":
                    "foos": [
                        {
                            "mahna": "mahna"
                        }
                    ]
                }
            }
        `);
    await expect(json.compile()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Unexpected token / in JSON at position 10"`
    );
});
