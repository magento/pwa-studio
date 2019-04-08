const { dirname, join } = require('path');
const pkgDir = require('pkg-dir');

async function resolveModuleDirectory(moduleName, ...segments) {
    const resolved = require.resolve(moduleName);
    const directory = dirname(resolved);
    const moduleRoot = await pkgDir(directory);
    return join(moduleRoot, ...segments);
}

module.exports = resolveModuleDirectory;
