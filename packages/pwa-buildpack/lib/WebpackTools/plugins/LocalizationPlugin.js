const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');
const walk = require('../../util/klaw-bound-fs');
const merge = require('merge');
const InjectPlugin = require('webpack-inject-plugin').default;

const i18nDir = 'i18n';
const localeFileNameRegex = /([a-z]{2}_[A-Z]{2})\.json$/;

/**
 * Localization Plugin to collect all translations from NPM modules and create single translation file for each locale
 *
 * Options:
 *  - context: string provide the context that the build is running within
 *  - dirs[]: array of directories to search for i18n/*.csv files
 *  - virtualModules: instance of VirtualModulesPlugin to create virtual modules during the build
 */
class LocalizationPlugin {
    /**
     * @param {object} opts
     */
    constructor(opts) {
        this.opts = opts;
    }

    apply(compiler) {
        this.compiler = compiler;
        this.injectLocalizationLoader();
    }

    injectLocalizationLoader() {
        debug('applying InjectPlugin to create global for localization import');
        new InjectPlugin(() => this.buildFetchModule()).apply(this.compiler);
    }

    async buildFetchModule() {
        const { inputFileSystem, hooks } = this.compiler;
        const { dirs, context, virtualModules } = this.opts;

        // Iterate through every module which declares the i18n specialFlag along with the context venia-concept dir
        let locales = {};
        for (const dir of dirs) {
            const localeDir = path.join(dir, i18nDir);
            try {
                const stats = inputFileSystem.statSync(localeDir);

                if (stats.isDirectory()) {
                    const packageTranslations = await this.findTranslationFiles(
                        inputFileSystem,
                        localeDir
                    );
                    locales = this.mergeLocales(locales, packageTranslations);
                } else {
                    throw new Error('Path is not directory.');
                }
            } catch (e) {
                debug(e);

                if (dir !== context) {
                    throw new Error(
                        `${dir} module has i18n special flag, but i18n directory does not exist at ${localeDir}.`
                    );
                }
            }
        }

        if (!locales) {
            debug(
                'No locales found while traversing all modules with i18n flag.'
            );
        }

        // Merge all located translation files together and return their paths for a dynamic import
        const mergedLocalesPaths = await this.writeMergedVirtualLocales(
            context,
            locales,
            inputFileSystem,
            virtualModules
        );

        debug('Merged locales into path.', mergedLocalesPaths);

        /**
         * Build up our importer factory, this provides a global function called fetchLocaleData which in turn completes
         * a dynamic import of the combined file generated in the step above.
         * @type {string}
         */
        const importerFactory = `function () {
            return function getLocale(locale) {
                ${Object.keys(locales).map(locale => {
                    return `if (locale === "${locale}") { 
                        return import(/* webpackChunkName: "i18n" */'${
                            mergedLocalesPaths[locale]
                        }');
                    }`;
                }).join('')}
                
                throw new Error('Unable to locate locale ' + locale + ' within generated dist directory.');
            }
        }`;

        hooks.afterCompile.tap('LocalizationPlugin', compilation => {
            // Add global file dependencies for all the found translation files
            Object.values(locales).forEach(localePaths => {
                localePaths.forEach(localePath => {
                    compilation.fileDependencies.add(localePath);
                });
            });
        });

        hooks.emit.tap('LocalizationPlugin', compilation => {
            // Add individual fileDependencies for each i18n chunk
            compilation.chunks.forEach(chunk => {
                if (chunk.name === 'i18n') {
                    chunk.getModules().forEach(chunkModule => {
                        const chunkLocale = path.parse(chunkModule.resource)
                            .name;
                        if (
                            locales[chunkLocale] &&
                            Array.isArray(locales[chunkLocale])
                        ) {
                            locales[chunkLocale].forEach(localePath => {
                                chunkModule.buildInfo.fileDependencies.add(
                                    localePath
                                );
                            });
                        }
                    });
                }
            });
        });

        return `;window.fetchLocaleData = (${importerFactory})()`;
    }

    /**
     * Merge single locales into combined files and create virtual modules for webpack to import
     *
     * @param context
     * @param locales
     * @param inputFileSystem
     * @param virtualModules
     * @returns {Promise<void>}
     */
    async writeMergedVirtualLocales(
        context,
        locales,
        inputFileSystem,
        virtualModules
    ) {
        const distDirectory = context;

        debug('Located all translation files.', locales);

        const combinedLocale = {};

        for (const locale of Object.keys(locales)) {
            debug(`Combining locale for ${locale}`);
            const files = locales[locale];
            let combined = {};
            for (const file of files) {
                const data = inputFileSystem.readFileSync(file, 'utf8');
                combined = merge.recursive(combined, JSON.parse(data));
            }

            const localePath = path.join(distDirectory, `${locale}.json`);

            virtualModules.writeModule(localePath, JSON.stringify(combined));
            combinedLocale[locale] = localePath;
        }

        return combinedLocale;
    }

    /**
     * Merge locales together creating an object with each locale and the located translations for the locale
     *
     * @param current
     * @param update
     * @returns {*}
     */
    mergeLocales(current, update) {
        Object.keys(update).forEach(key => {
            if (typeof current[key] === 'undefined') {
                current[key] = [];
            }
            if (Array.isArray(current[key]) && Array.isArray(update[key])) {
                current[key].push(...update[key]);
            }
        });

        return current;
    }

    /**
     * Locate translation files within a specific i18n directory
     *
     * @param inputFileSystem
     * @param dir
     * @returns {Promise<object>}
     */
    findTranslationFiles(inputFileSystem, dir) {
        return new Promise(resolve => {
            const translations = {};
            const done = () => resolve(translations);
            walk(dir, { fs: inputFileSystem })
                .on('readable', function() {
                    let item;
                    while ((item = this.read())) {
                        if (
                            item.stats.isFile() &&
                            localeFileNameRegex.test(item.path)
                        ) {
                            debug(`Found localization file: ${item.path}`);
                            const localeMatch = item.path.match(
                                localeFileNameRegex
                            );
                            if (localeMatch && localeMatch[1]) {
                                const locale = localeMatch[1];
                                if (!Array.isArray(translations[locale])) {
                                    translations[locale] = [];
                                }
                                translations[locale].push(item.path);
                            }
                        }
                    }
                })
                .on('error', done)
                .on('end', done);
        });
    }
}

module.exports = LocalizationPlugin;
