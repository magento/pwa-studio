import fetchRootComponent from '../fetchRootComponent';
import webpackInterop from '../webpackInterop';

jest.mock('../webpackInterop', () => ({
    loadChunk: jest.fn(),
    require: jest.fn()
}));

test('Resolves to default export of requested module', async () => {
    webpackInterop.loadChunk.mockReturnValueOnce(Promise.resolve());
    const stubModuleNamespaceObject = {
        default: () => {}
    };
    webpackInterop.require.mockReturnValueOnce(stubModuleNamespaceObject);

    expect(await fetchRootComponent(0, 0)).toBe(
        stubModuleNamespaceObject.default
    );
});

test('Should reject with a meaningful error when module is not in chunk', async () => {
    expect.hasAssertions();
    webpackInterop.loadChunk.mockReturnValueOnce(Promise.resolve());

    try {
        await fetchRootComponent(0, 0);
    } catch (err) {
        expect(err.message).toMatch(/without a matching RootComponent/);
    }
});

test('Should reject with a meaningful error when default export is not a function', async () => {
    expect.hasAssertions();
    webpackInterop.loadChunk.mockReturnValueOnce(Promise.resolve());
    webpackInterop.require.mockReturnValueOnce({});

    try {
        await fetchRootComponent(0, 0);
    } catch (err) {
        expect(err.message).toMatch(/missing a default export/);
    }
});
