const queries = require('../');

test('no "#" comments in graphql strings', () => {
    expect(queries.getMediaUrl).not.toContain('#');
    expect(queries.getStoreConfigData).not.toContain('#');
    expect(queries.getAvailableStoresConfigData).not.toContain('#');
    expect(queries.getSchemaTypes).not.toContain('#');
});
