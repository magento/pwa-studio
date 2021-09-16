const { resolve } = require('path');
const os = require('os');
const fs = require('fs');
const fetch = require('node-fetch');
const tar = require('tar');
const findCacheDir = require('find-cache-dir');
const prettyLogger = require('../util/pretty-logger');

/**
 * @typedef {import('fs')} NodeFS
 */

/**
 *
 * Retrieves, caches, and provides paths to `buildpack create` "templates".
 *
 * @class TemplateRepository
 *
 */
class TemplateRepository {
    /**
     * Create a TemplateRepository.
     * @param {Object} config
     * @param {string} [config.cwd=process.cwd()] - Working directory from which to resolve caches and other paths.
     * @param {boolean} [cache=true] - Try local cache before fetching remote
     * packages.
     * @param {NodeFS} [fs=require('fs')] - Filesystem to use; must conform to
     * Node's `fs` module.
     * @param {string} [registry=https://registry.npmjs.com] - NPM registry to
     * use to look up and download templates.
     * @param {boolean} [local=false] - Skip cache and remote resolution;
     * resolve package from local filesystem only.
     */
    constructor(config) {
        Object.assign(this, this.defaultConfig, config);
    }

    /**
     * @ignore
     */
    get defaultConfig() {
        return {
            cwd: process.cwd(),
            cache: true,
            fs,
            registry: 'https://registry.npmjs.com',
            local: false
        };
    }

    /**
     * Local filesystem directory where cached templates are kept.
     *
     * @readonly
     * @memberof TemplateRepository
     * @type string
     */
    get cacheDir() {
        if (this._cacheDir === undefined) {
            const foundCacheDir = findCacheDir({
                name: '@magento/pwa-buildpack',
                cwd: this.cwd,
                create: true
            });
            this._cacheDir =
                foundCacheDir && resolve(foundCacheDir, 'scaffold-templates');
        }
        return this._cacheDir;
    }

    /**
     * Looks up package in cache. Returns false if none is found.
     *
     * @async
     * @param {string} packageName - Package name, e.g. `@magento/venia-concept`
     * @returns {Promise<(string|false)>} Path to cached package; `false` if
     * package isn't cached.
     */
    async getPackageFromCache(packageName) {
        const packageDir = resolve(this.cacheDir, packageName);
        // NPM extracts a tarball to './package'
        const packageRoot = resolve(packageDir, 'package');
        let packageRootFiles;
        try {
            packageRootFiles = this.fs.readdirSync(packageRoot);
        } catch (e) {
            // Not cached, which is not an error.
            return false;
        }
        if (packageRootFiles.includes('package.json')) {
            prettyLogger.info(`Found ${packageName} template in cache`);
            return packageRoot;
        }
        return false;
    }

    /**
     * Looks up package name on NPM registry. Downloads and extract that package into cache, or into a temp dir if cache is disabled.
     *
     * @async
     * @param {string} packageName - Package name, e.g. `@magento/venia-concept`
     * @returns {Promise<string>} - Path to the newly downloaded template package.
     */
    async getPackageFromRegistry(packageName) {
        const packageVersion = 'latest'; // TODO: make configurable
        const cacheDir = (this.cache && this.cacheDir) || os.tmpdir();
        const packageDir = resolve(cacheDir, packageName);
        let tarballUrl;
        try {
            prettyLogger.info(`Finding ${packageName} tarball on NPM`);
            const registryResponse = await fetch(
                new URL(`${packageName}/${packageVersion}`, this.registry).href
            );
            const registryJson = await registryResponse.json();
            tarballUrl = registryJson.dist.tarball;
        } catch (e) {
            throw new Error(
                `Invalid template: could not get tarball url from npm: ${
                    e.message
                }`
            );
        }

        let tarballStream;
        try {
            prettyLogger.info(`Downloading and unpacking ${tarballUrl}`);
            tarballStream = (await fetch(tarballUrl)).body;
        } catch (e) {
            throw new Error(
                `Invalid template: could not download tarball from NPM: ${
                    e.message
                }`
            );
        }
        try {
            await this.extractToDir(tarballStream, packageDir);
            prettyLogger.info(`Unpacked ${packageName}`);
            return resolve(packageDir, 'package');
        } catch (e) {
            throw new Error(
                `Could not extract ${tarballUrl} to ${packageDir}: ${e.message}`
            );
        }
    }

    /**
     * Extracts tarball to directory.
     *
     * @async
     * @param {import('stream').Readable} tarballStream
     * @param {string} targetDir
     * @protected
     * @returns {Promise<void>}
     */
    async extractToDir(tarballStream, targetDir) {
        this.fs.mkdirSync(targetDir, { recursive: true });
        return new Promise((res, rej) => {
            const untarStream = tar.extract({
                cwd: targetDir
            });
            tarballStream.pipe(untarStream);
            untarStream.on('finish', () => {
                // NPM extracts a tarball to './package'
                const packageRoot = resolve(targetDir, 'package');
                res(packageRoot);
            });
            untarStream.on('error', rej);
            tarballStream.on('error', rej);
        });
    }

    /**
     * Validates and returns local directory of template. Currently is only called
     * in scaffolding debug mode. **Currently works only for Venia; will throw
     * unless its argument is `@magento/venia-concept`.**
     *
     * @todo Make this support Git repos and other local folders.
     * @async
     * @private
     * @param {string} packageName - Package name, e.g. `@magento/venia-concept`
     * @returns {Promise<string>} Path to package on disk.
     */
    async makeDirFromDevPackage(packageName) {
        // assume we are in pwa-studio repo
        // todo: support git urls
        prettyLogger.warn(`Bypassing cache and NPM registry.`);
        if (packageName !== '@magento/venia-concept') {
            throw new Error(
                `Local template mode currently only works using "@magento/venia-concept" as the template. Supplied template name "${packageName}" is unsupported.`
            );
        }
        return resolve(__dirname, '../../../venia-concept');
    }

    /**
     * Get or create a directory on the local filesystem containing the
     * requested template package.  If `local: true` in this instance, will skip
     * all resolution and return the absolute path to the local package.  Tries
     * cache first unless this instance was created with `cache` set to `false`.
     * Then tries remote registry.
     *
     * Order of operations:
     *
     * - **Local mode**: Provided a local path, will confirm that the package contains a package.json and then return its
     * argument unchanged.
     * - **Cache mode**: Unless this instance has `cache` set to `false`, will run {@link TemplateRepository#getPackageFromPath}.
     * - **Remote mode**: If `cache` is `false`, OR the template was not found in cache, will run {@link TemplateRepository#getPackageFromRegistry}.
     *
     * @async
     * @param {string} templateName - Name of template, or local path to
     * template.
     * @returns {Promise<string>} Local path to retrieved or created package.
     */
    async findTemplateDir(templateName) {
        try {
            this.fs.readdirSync(templateName);
            prettyLogger.info(`Found ${templateName} directory`);
            // if that succeeded, then...
            this.fs.readFileSync(resolve(templateName, 'package.json'));
            // And if that succeeded, then
            return templateName;
        } catch (e) {
            let packageDir;
            if (this.local) {
                return this.makeDirFromDevPackage(templateName);
            }
            if (!this.cache) {
                prettyLogger.warn(`Bypassing cache to get "${templateName}"`);
            } else {
                packageDir = await this.getPackageFromCache(templateName);
            }
            return packageDir || this.getPackageFromRegistry(templateName);
        }
    }
}

module.exports = TemplateRepository;
