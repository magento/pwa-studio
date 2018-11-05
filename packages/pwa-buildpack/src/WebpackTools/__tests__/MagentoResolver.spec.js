const MagentoResolver = require('../MagentoResolver');
test('static configure() produces a webpack resolver config', async () => {
    await expect(
        MagentoResolver.configure({ paths: { root: 'fakeRoot' } })
    ).resolves.toEqual({
        modules: ['fakeRoot', 'node_modules'],
        mainFiles: ['index'],
        extensions: ['.mjs', '.js', '.json', '.graphql']
    });
});
test('static configure() throws if required paths are missing', async () => {
    await expect(
        MagentoResolver.configure({ paths: { root: false } })
    ).rejects.toThrow('paths.root must be of type string');
});
