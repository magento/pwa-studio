const path = require('path');
const packageRoot = path.resolve(__dirname, '../..');
const glob = require('fast-glob');
const Trackable = require('@magento/pwa-buildpack/lib/BuildBus/Trackable');
const TargetableHook = require('./TargetableHook');

/**
 * Builds a registry of modules existing in a given directory by walking the
 * filesystem. Designed for Peregrine, to be used as the API for `talons` and
 * `hooks` targets. Because it reads the filesystem, it's no longer necessary
 * to manually maintain a list of supported hooks and talons.
 */
class HookInterceptorSet extends Trackable {
    /**
     * Direct access to the array of all generated hooks. Used for retrieving all the transform requests.
     * @type {TransformRequest[]}
     * @see [TransformRequest]{@link https://pwastudio.io/pwa-buildpack/reference/transform-requests/#addTransform}
     */
    get allModules() {
        return this._all;
    }
    /**
     * Creates a HookInterceptorSet that will look for modules in a folder tree.
     * @param {string} hookFolder - Absolute path to the base folder to check recursively for hooks.
     * @param {Target} target - Target to call to run interceptors for the hooks.
     */
    constructor(hookFolder, target) {
        super();
        this._hookDir = hookFolder;
        this._all = [];
        this._target = target;
        this.attach(this.constructor.name, target);
    }
    /**
     * Create a nested object structure mirroring the filesystem structure, so
     * that CartPage/GiftCards/useGiftCard.js is available at
     * hookInterceptorSet.CartPage.GiftCards.useGiftCart.
     *
     * @param {string[]} segments - Array of object paths.
     * @returns {object} Generated namespace object.
     * @private
     */
    _getNamespace(segments) {
        let current = this;
        for (const segment of segments) {
            current = current[segment] || (current[segment] = {});
        }
        return current;
    }
    /**
     * Reads the filesystem, starting at the base directory passed into the
     * constructor. Uses this data to build up a namespaced API object that
     * mirrors the folder structure, with TargetableHooks for the leaf nodes
     * representing hook modules.
     *
     */
    async populate() {
        this.track('prepopulate', { status: `reading ${this._hookDir}` });
        const hookPaths = await glob('**/use*.{mjs,js,mts,ts}', {
            cwd: this._hookDir,
            ignore: ['**/__*__/**'],
            suppressErrors: true,
            onlyFiles: true
        });
        this.track('populate', { count: hookPaths.length, hookPaths });
        for (const hookPath of hookPaths) {
            const isNested = hookPath.includes(path.sep);
            const segments = isNested
                ? path.dirname(hookPath).split(path.sep)
                : [];
            const namespace = this._getNamespace(segments);
            const hookName = path.basename(hookPath, path.extname(hookPath));
            const targetedHook = new TargetableHook(
                path.join(
                    '@magento/peregrine',
                    path.relative(
                        packageRoot,
                        path.resolve(this._hookDir, hookPath)
                    )
                ),
                { exportName: hookName },
                this
            );
            namespace[hookName] = targetedHook;
            this._all.push(targetedHook);
        }
    }
    /**
     * Generate the namespaced API with HookInterceptorSet#populate and call
     * `this._target` asynchronously to run third-party interceptors.
     */
    async runAll() {
        if (this._all.length === 0) {
            await this.populate();
        }
        await this._target.promise(this);
    }
}

module.exports = HookInterceptorSet;
