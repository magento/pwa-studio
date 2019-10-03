jest.mock('../../../Utilities/findPackageRoot');

const findPackageRoot = require('../../../Utilities/findPackageRoot');
const { getIncludeFeatures } = require('..');

const mockPackages = pkgs =>
    pkgs.forEach(pkgPath =>
        findPackageRoot.local.mockResolvedValueOnce(pkgPath)
    );

test('returns flags for directory of resolved package', async () => {
    const pkg1 = '/to/package2';
    const pkg2 = '/other/pkg3';
    mockPackages([pkg1, pkg2]);
    const packagesWithFeature = await getIncludeFeatures({
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
    });
    expect(packagesWithFeature('flag1')).toContain(pkg1);
    expect(packagesWithFeature('flag2')).toMatchObject([pkg1, pkg2]);
    expect(packagesWithFeature('flag3')).toHaveLength(0);
});
