const path = require('path');
const extensionAggregator = require('../extension-aggregator');

const extensionsRoot = path.join(__dirname, '__fixtures__/extensions');

test('rejects w/ useful message when "extensionsRoot" is missing', async () => {
    expect.hasAssertions();
    try {
        await extensionAggregator({});
    } catch (err) {
        expect(err.message).toMatch(/must be a string/i);
    }
});

test('rejects w/ useful message when "extensionsRoot" is relative path', async () => {
    expect.hasAssertions();
    try {
        await extensionAggregator({
            extensionsRoot: 'foo/bar'
        });
    } catch (err) {
        expect(err.message).toMatch(/must be an absolute path/i);
    }
});

test('resolves to config with all extensions', async () => {
    const extensions = await extensionAggregator({ extensionsRoot });
    const expectedRoots = [
        path.join(extensionsRoot, 'extension1'),
        path.join(extensionsRoot, 'extension2')
    ];
    extensions.forEach(ext => {
        expect(expectedRoots).toContain(ext.root);
    });
    expect(extensions).toHaveLength(2);
});

test('.sync throws w/ useful messagewhen "extensionsRoot" is missing', () => {
    const fn = () => extensionAggregator.sync({});
    expect(fn).toThrow(/must be a string/i);
});

test('.sync throws w/ useful message when "extensionsRoot" is relative path', () => {
    const fn = () =>
        extensionAggregator.sync({
            extensionsRoot: 'foo/bar'
        });
    expect(fn).toThrow(/must be an absolute path/i);
});

test('.sync resolves to config with all extensions', () => {
    const extensions = extensionAggregator.sync({ extensionsRoot });
    const expectedRoots = [
        path.join(extensionsRoot, 'extension1'),
        path.join(extensionsRoot, 'extension2')
    ];
    extensions.forEach(ext => {
        expect(expectedRoots).toContain(ext.root);
    });
    expect(extensions).toHaveLength(2);
});
