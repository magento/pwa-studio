const Buildpack = require('../');

test('exposes all Utilities and WebpackTools at root', () => {
    const isExposedAtRoot = obj =>
        Object.entries(obj).forEach(([name, value]) => {
            expect(Buildpack[name]).toBe(value);
        });
    isExposedAtRoot(Buildpack.Utilities);
    isExposedAtRoot(Buildpack.WebpackTools);
});
