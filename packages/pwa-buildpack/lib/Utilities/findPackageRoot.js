/**
 * Given a package name, return an absolute path on the filesystem where the
 * files for that package can be found.
 *
 * If the package name is an NPM package, and it is not available locally,
 * this command will run a remote fetch to NPM to get the tarball and unzip it.
 */
const debug = require('../util/debug').makeFileLogger(__filename);
const path = require('path');
const os = require('os');
const fse = require('fs-extra');
const tar = require('tar');
const fetch = require('node-fetch');
const pkgDir = require('pkg-dir');
const execa = require('execa');

async function fromLocalPath(packageName) {
    try {
        // If the argument resolves to a local directory with a package.json
        // file, then prefer that.
        const packagePath = path.resolve(packageName);
        const contents = await fse.readdir(packagePath);
        if (contents.includes('package.json')) {
            debug(`Found package in local directory ${packagePath}`);
            return packagePath;
        }
        return null;
    } catch (e) {
        debug(
            'fromLocalPath: ${packagePath} is not a valid local directory: %s',
            e.message
        );
        return null;
    }
}

async function fromNodeModule(packageName, contextRequire) {
    // Why not just require.resolve(packageName) ? Because a package may not be
    // designed as a requireable node module, so it may not have an index file
    // and require.resolve hates that. It will at least have a package.json if
    // it's a valid package.
    let packageJsonPath, resolvedPackagePath;

    try {
        packageJsonPath = path.join(packageName, 'package.json');
    } catch (e) {
        throw new Error(
            `fromNodeModule: "packageName" must be a valid package or directory name, was: "${packageName}" `
        );
    }

    try {
        resolvedPackagePath = contextRequire.resolve(packageJsonPath);
        debug('Found ${packageName} as a module');
    } catch (e) {
        debug(`Could not locate ${packageName} as a module`);
        return null;
    }

    const packageRootDir = await pkgDir(resolvedPackagePath);
    if (packageRootDir) {
        debug('Found root of ${packageName} at ${packageRootDir}');
        return packageRootDir;
    } else {
        debug(
            `Could not find a package.json file in ${resolvedPackagePath} or any ancestor!`
        );
        return null;
    }
}

async function fromNpmRegistry(packageName) {
    const tempPackageDir = path.resolve(os.tmpdir(), packageName);
    // NPM extracts a tarball to './package'
    const packageRoot = path.resolve(tempPackageDir, 'package');
    let tarballUrl;
    try {
        debug(`Finding ${packageName} tarball on NPM`);
        tarballUrl = JSON.parse(
            (await execa.shell(`npm view --json ${packageName}`, {
                encoding: 'utf-8'
            })).stdout
        ).dist.tarball;
    } catch (e) {
        debug(
            `Invalid package "${packageName}": could not get tarball url from npm: ${
                e.message
            }`
        );
        return null;
    }

    let tarballStream;
    try {
        debug(`Downloading and unpacking ${tarballUrl}`);
        tarballStream = (await fetch(tarballUrl)).body;
    } catch (e) {
        throw new Error(
            `Invalid package "${packageName}": could not download tarball from NPM: ${
                e.message
            }`
        );
    }

    await fse.ensureDir(tempPackageDir);
    return new Promise((res, rej) => {
        const fail = e =>
            rej(new Error(`Could not extract ${tarballUrl}: ${e.message}`));
        debug(`Extracting ${tarballUrl} to ${tempPackageDir}`);
        try {
            const untarStream = tar.extract({
                cwd: tempPackageDir
            });
            untarStream.on('finish', () => {
                debug(`Extracted ${packageName}.`);
                res(packageRoot);
            });
            untarStream.on('error', fail);
            tarballStream.on('error', fail);
            tarballStream.pipe(untarStream);
        } catch (e) {
            fail(e);
        }
    });
}

module.exports = {
    async local(packageName, contextRequire = require) {
        return (
            (await fromLocalPath(packageName)) ||
            (await fromNodeModule(packageName, contextRequire))
        );
    },
    async remote(packageName) {
        return fromNpmRegistry(packageName);
    }
};
