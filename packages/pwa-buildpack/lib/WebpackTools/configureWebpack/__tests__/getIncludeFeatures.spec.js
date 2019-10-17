jest.mock('pkg-dir');

const pkgDir = require('pkg-dir');
const { getIncludeFeatures } = require('..');

const contextRequire = {
    resolve: jest.fn()
};

const mockPackages = pkgs =>
    pkgs.forEach(({ requirePath, pkgPath }) => {
        contextRequire.resolve.mockReturnValueOnce(requirePath);
        pkgDir.mockResolvedValueOnce(pkgPath);
    });

test('returns flags for directory of resolved package', async () => {
    const packages = [
        { requirePath: '/to/package2/lib/main.js', pkgPath: '/to/package2' },
        { requirePath: '/other/pkg3/index.js', pkgPath: '/other/pkg3' }
    ];
    mockPackages(packages);
    const packagesWithFeature = await getIncludeFeatures(
        {
            special: {
                '@somescope/package1': {
                    flag1: true,
                    flag2: true,
                    flag3: false
                },
                '@somescope/package2': {
                    flag2: true
                }
            }
        },
        contextRequire
    );
    expect(packagesWithFeature('flag1')).toMatchObject([packages[0].pkgPath]);
    expect(packagesWithFeature('flag2')).toMatchObject([
        packages[0].pkgPath,
        packages[1].pkgPath
    ]);
    expect(packagesWithFeature('flag3')).toHaveLength(0);
});
