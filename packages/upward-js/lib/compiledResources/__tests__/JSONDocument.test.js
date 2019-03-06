const JSONDocument = require('../JSONDocument');
const AbstractCompiledResource = require('../AbstractCompiledResource');

test('supported extension is .json', () => {
    expect(JSONDocument.supportedExtensions).toEqual(
        expect.arrayContaining(['.json'])
    );
});

test('extends AbstractCompiledResource concretely', () => {
    const io = {
        readFile: () => {}
    };
    const instantiate = () => new JSONDocument('', io);
    expect(instantiate).not.toThrow();
    expect(instantiate()).toBeInstanceOf(AbstractCompiledResource);
});

test('compile returns a parsed JSON object', async () => {
    const io = {};
    const doc = new JSONDocument('{ "foo": "__bar__" }', io);
    const json = await doc.compile();
    expect(json).toHaveProperty('foo', '__bar__');
});
