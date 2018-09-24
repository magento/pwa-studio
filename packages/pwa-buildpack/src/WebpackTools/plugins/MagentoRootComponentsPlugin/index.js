const fs = require('../../../util/promisified/fs');
const readdir = require('readdir-enhanced');
const optionsValidator = require('../../../util/options-validator');
const directiveParser = require('@magento/directive-parser');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const validateConfig = optionsValidator('MagentoResolver', {
    rootComponentsDirs: 'string[]'
});
const { RawSource } = require('webpack-sources');
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
    constructor(opts = {}) {
        validateConfig('', opts);
        this.opts = opts;
    }

    apply(compiler) {
        const { context } = compiler.options;
        const { rootComponentsDirs } = this.opts;

        // Create a list of absolute paths for root components. When a
        // relative path is found, resolve it from the root context of
        // the webpack build
        const rootComponentsDirsAbs = rootComponentsDirs.map(
            dir => (isAbsolute(dir) ? dir : join(context, dir))
        );

        compiler.hooks.beforeRun.tap(
            'MagentoRootComponentsPlugin',
            async () => {
                const rootComponentImporters = await rootComponentsDirsAbs.reduce(
                    async (importersPromise, rootComponentDir) => {
                        const importerSources = await importersPromise;
                        const rootComponentFiles = await readdir(
                            rootComponentDir,
                            {
                                basePath: rootComponentDir,
                                deep: true,
                                filter: /m?[jt]s$/
                            }
                        );
                        await Promise.all(
                            rootComponentFiles.map(async rootComponentFile => {
                                const rootComponentSource = await fs.readFile(
                                    rootComponentFile,
                                    'utf8'
                                );
                                const {
                                    directives = [],
                                    errors
                                } = directiveParser(rootComponentSource);
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
                                }

                                pageTypes.forEach(pageType => {
                                    const key = toRootComponentMapKey(
                                        pageType,
                                        variant
                                    );
                                    importerSources[
                                        key
                                    ] = `() => import(/* webpackChunkName: "${key}" */'${relative(
                                        compiler.options.context,
                                        rootComponentFile
                                    )}')`;
                                });
                            })
                        );
                        return importerSources;
                    },
                    Promise.resolve({})
                );

                const contents = `
const rootComponentsMap = {
${Object.entries(rootComponentImporters)
                    .map(entry => entry.join(':'))
                    .join(',\n')}
};
const key = ${toRootComponentMapKey.toString()};
export default function fetchRootComponent(type, variant = 'default') {
    return rootComponentsMap[key(type, variant)]();
};
`;
                new VirtualModulePlugin({
                    moduleName: 'FETCH_ROOT_COMPONENT',
                    contents
                }).apply(compiler);
            }
        );
    }
}

module.exports = MagentoRootComponentsPlugin;
