const debug = require('../../util/debug').makeFileLogger(__filename);
const walk = require('../../util/klaw-bound-fs');
const InjectPlugin = require('webpack-inject-plugin').default;
const directiveParser = require('@magento/directive-parser');
const { isAbsolute, join, relative } = require('path');
const micromatch = require('micromatch');

const prettyLogger = require('../../util/pretty-logger');

const toRootComponentMapKey = function(type, variant) {
    return 'RootCmp_' + type + '__' + (variant || 'default');
};

// ES Modules have a "default" property, CommonJS modules do not
/* istanbul ignore next: depends on environment */
const esModuleInterop = function(mod) {
    return mod.default || mod;
};

const extensionRE = /m?[jt]s$/;

/**
 * @description webpack plugin that creates chunks for each
 * individual RootComponent in a provided array of directories, and produces a
 * file which imports each one as a separate chunk.
 */
class RootComponentsPlugin {
    /**
     * @param {object} opts
     * @param {string[]} opts.rootComponentsDirs All directories to be searched for RootComponents
     */
    constructor(opts) {
        this.opts = opts;
    }

    apply(compiler) {
        this.compiler = compiler;
        this.readFile = (...args) =>
            this.compiler.inputFileSystem.readFileSync(...args);
        this.injectRootComponentLoader();
    }

    injectRootComponentLoader() {
        debug('applying InjectPlugin to create global');
        new InjectPlugin(() => this.buildFetchModule()).apply(this.compiler);
    }

    findRootComponentsIn(dir) {
        const ignore = this.opts.ignore || ['__*__'];
        return new Promise(resolve => {
            const jsFiles = [];
            const done = () => resolve(jsFiles);
            walk(dir, {
                filter: x => !micromatch.some(x, ignore, { basename: true }),
                fs: this.compiler.inputFileSystem
            })
                .on('readable', function() {
                    let item;
                    while ((item = this.read())) {
                        if (
                            item.stats.isFile() &&
                            extensionRE.test(item.path)
                        ) {
                            debug(`will check ${item.path} for RootComponent`);
                            jsFiles.push(item.path);
                        }
                    }
                })
                .on('error', done)
                .on('end', done);
        });
    }
    async buildFetchModule() {
        const { context, rootComponentsDirs } = this.opts;

        // Create a list of absolute paths for root components. When a
        // relative path is found, resolve it from the root context of
        // the webpack build
        const rootComponentsDirsAbs = rootComponentsDirs.map(dir =>
            isAbsolute(dir) ? dir : join(context, dir)
        );
        debug(
            'buildFetchModule: absolute root component dirs: %o',
            rootComponentsDirsAbs
        );
        const rootComponentImporters = await rootComponentsDirsAbs.reduce(
            async (importersPromise, rootComponentDir) => {
                debug('gathering files from %s', rootComponentDir);
                const [importerSources, rootComponentFiles] = await Promise.all(
                    [
                        importersPromise,
                        this.findRootComponentsIn(rootComponentDir)
                    ]
                );
                debug(
                    'files from %s: %o',
                    rootComponentDir,
                    rootComponentFiles
                );
                await Promise.all(
                    rootComponentFiles.map(async rootComponentFile => {
                        debug('reading file %s', rootComponentFile);
                        const rootComponentSource = await this.readFile(
                            rootComponentFile,
                            { encoding: 'utf8' }
                        );
                        debug(
                            'parsing %s source for directives',
                            rootComponentSource.slice(0, 80)
                        );
                        const { directives, errors } = directiveParser(
                            '\n' + rootComponentSource + '\n'
                        );
                        debug(
                            'directive parse found in %s, %o and errors: %o',
                            rootComponentFile,
                            directives,
                            errors
                        );
                        if (errors.length) {
                            // for now, errors just mean no directive was found
                            return;
                        }
                        debug('filtering %o for RootComponents', directives);
                        const rootComponentDirectives = directives.filter(
                            d => d.type === 'RootComponent'
                        );
                        debug(
                            'found %s directives: %o',
                            rootComponentDirectives.length,
                            rootComponentDirectives
                        );
                        if (rootComponentDirectives.length === 0) {
                            return;
                        }

                        if (rootComponentDirectives.length > 1) {
                            prettyLogger.warn(
                                `Found more than 1 RootComponent Directive in ${rootComponentFile}. Only the first will be used`
                            );
                        }

                        const {
                            pageTypes,
                            variant
                        } = rootComponentDirectives[0];

                        if (!pageTypes || pageTypes.length === 0) {
                            prettyLogger.warn(
                                `No pageTypes specified for RootComponent ${rootComponentFile}. RootComponent will never be used.`
                            );
                        } else {
                            pageTypes.forEach(pageType => {
                                debug(
                                    'creating root component map key for %s',
                                    rootComponentFile,
                                    pageType
                                );
                                const key = toRootComponentMapKey(
                                    pageType,
                                    variant
                                );
                                importerSources[
                                    key
                                ] = `function () { return import(/* webpackChunkName: "${key}" */'./${relative(
                                    context,
                                    rootComponentFile
                                )}')}`;
                            });
                        }
                    })
                );
                return importerSources;
            },
            Promise.resolve({})
        );

        const rootComponentEntries = Object.entries(rootComponentImporters);

        if (rootComponentEntries.length === 0) {
            throw new Error(
                `No RootComponents were found in any of these directories: \n - ${rootComponentsDirsAbs.join(
                    '\n - '
                )}.\n\nThe MagentoRouter will not be able to load SEO URLs.`
            );
        }

        // create stringified, mapped object
        const rootComponentsMap = `{${rootComponentEntries
            .map(entry => entry.join(':'))
            .join(',\n')}}`;

        // create importer function to expose to other modules
        const importer = `function importRootComponent(type, variant) {
            const importerKey = getKey(type, variant);
            return rootComponentsMap[importerKey]()
                .then(esModuleInterop);
        }`;

        // add shared utility functions, mapping, and importer to factory fn
        const importerFactory = `function () {
            const getKey = ${toRootComponentMapKey.toString()};
            const esModuleInterop = ${esModuleInterop.toString()};
            const rootComponentsMap = ${rootComponentsMap};
            return ${importer}
        }`;

        // assign factory return value, the importer function, to global
        const wrapped = `;globalThis.fetchRootComponent = (${importerFactory})()`;

        return wrapped;
    }
}

module.exports = RootComponentsPlugin;
