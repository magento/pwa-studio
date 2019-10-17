const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');
const pkgDir = require('pkg-dir');

async function getIncludeFeatures({ special }, contextRequire) {
    const features = await Promise.all(
        Object.entries(special).map(async ([packageName, flags]) => {
            const packagePath = await pkgDir(
                path.dirname(contextRequire.resolve(packageName))
            );
            debug(
                'found special %s dep at %s with flags %o',
                packageName,
                packagePath,
                flags
            );
            return [packagePath, flags];
        })
    );

    return function packagesWithFeature(flag) {
        return features.reduce(
            (hasIt, [packagePath, flags]) =>
                flags[flag] ? [...hasIt, packagePath] : hasIt,
            []
        );
    };
}
module.exports = getIncludeFeatures;
