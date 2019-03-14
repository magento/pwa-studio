const { readFile: fsReadFile } = require('fs');
const readFile = require('util').promisify(fsReadFile);
const { ProvidePlugin } = require('webpack');
const readdir = require('readdir-enhanced');
const directiveParser = require('@magento/directive-parser');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const { isAbsolute, join, relative } = require('path');

const toRootComponentMapKey = (type, variant = 'default') =>
    `RootCmp_${type}__${variant}`;

/**
 * @description webpack plugin that creates chunks for each
 * individual RootComponent in a provided array of directories, and produces a
 * file which imports each one as a separate chunk.
 */
class MagentoRootComponentsPlugin {
    /**
     * @param {object} opts
     * @param {string[]} opts.rootComponentsDirs All directories to be searched for RootComponents
     */
    constructor(opts) {
        this.opts = opts;
    }

    apply(compiler) {
        // Provide `fetchRootComponent` as a global: Expose the source as a
        // module, and then use a ProvidePlugin to inline it.
        new VirtualModulePlugin({
            moduleName: 'FETCH_ROOT_COMPONENT',
            contents: this.contents
        }).apply(compiler);
        new ProvidePlugin({
            fetchRootComponent: 'FETCH_ROOT_COMPONENT'
        }).apply(compiler);
    }

    async buildFetchModule() {
        const { context, rootComponentsDirs } = this.opts;

        // Create a list of absolute paths for root components. When a
        // relative path is found, resolve it from the root context of
        // the webpack build
        const rootComponentsDirsAbs = rootComponentsDirs.map(dir =>
            isAbsolute(dir) ? dir : join(context, dir)
        );
        const rootComponentImporters = await rootComponentsDirsAbs.reduce(
            async (importersPromise, rootComponentDir) => {
                const importerSources = await importersPromise;
                const rootComponentFiles = await readdir(rootComponentDir, {
                    basePath: rootComponentDir,
                    deep: true,
                    filter: /m?[jt]s$/
                });
                await Promise.all(
                    rootComponentFiles.map(async rootComponentFile => {
                        const rootComponentSource = await readFile(
                            rootComponentFile,
                            'utf8'
                        );
                        const { directives = [], errors } = directiveParser(
                            rootComponentSource
                        );
                        if (errors.length) {
                            // for now, errors just mean no directive was found
                            return;
                        }
                        const rootComponentDirectives = directives.filter(
                            d => d.type === 'RootComponent'
                        );

                        if (rootComponentDirectives.length === 0) {
                            return;
                        }

                        if (rootComponentDirectives.length > 1) {
                            console.warn(
                                `Found more than 1 RootComponent Directive in ${rootComponentFile}. Only the first will be used`
                            );
                        }

                        const {
                            pageTypes,
                            variant
                        } = rootComponentDirectives[0];

                        if (!pageTypes || pageTypes.length === 0) {
                            console.warn(
                                `No pageTypes specified for RootComponent ${rootComponentFile}. RootComponent will never be used.`
                            );
                        } else {
                            pageTypes.forEach(pageType => {
                                const key = toRootComponentMapKey(
                                    pageType,
                                    variant
                                );
                                importerSources[
                                    key
                                ] = `() => import(/* webpackChunkName: "${key}" */'${relative(
                                    context,
                                    rootComponentFile
                                )}')`;
                            });
                        }
                    })
                );
                return importerSources;
            },
            Promise.resolve({})
        );

        this.contents = `
const rootComponentsMap = {
${Object.entries(rootComponentImporters)
    .map(entry => entry.join(':'))
    .join(',\n')}
};
const key = ${toRootComponentMapKey.toString()};
export default function fetchRootComponent(type, variant = 'default') {
    return rootComponentsMap[key(type, variant)]().then(m => m.default || m);
};
`;
    }
}

async function makeRootComponentsPlugin(opts) {
    const plugin = new MagentoRootComponentsPlugin(opts);
    await plugin.buildFetchModule();
    return plugin;
}

module.exports = makeRootComponentsPlugin;
