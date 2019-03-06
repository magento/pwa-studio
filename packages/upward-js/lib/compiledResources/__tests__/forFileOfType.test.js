const {
    forFileOfType,
    GraphQLDocument,
    JSONDocument,
    MustacheTemplate
} = require('../');

test('returns constructor for a given file extension', () => {
    expect(forFileOfType('.graphql')).toBe(GraphQLDocument);
    expect(forFileOfType('.gql')).toBe(GraphQLDocument);
    expect(forFileOfType('.mst')).toBe(MustacheTemplate);
    expect(forFileOfType('.json')).toBe(JSONDocument);
});

test('returns constructor for a filename', () => {
    expect(forFileOfType('/Somewhere/somequery.graphql')).toBe(GraphQLDocument);
    expect(forFileOfType('/SomewhereElse/document.gql')).toBe(GraphQLDocument);
    expect(forFileOfType('someTpt.mst')).toBe(MustacheTemplate);
});

test('returns undefined for unsupported file type', () => {
    expect(forFileOfType('.pif')).toBeUndefined();
});
