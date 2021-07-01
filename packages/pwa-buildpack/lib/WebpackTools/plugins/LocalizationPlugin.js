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
        debug(
            'applying InjectPlugin to create global __fetchLocaleData__ for localization import'
        );
        new InjectPlugin(() => this.buildFetchModule()).apply(this.compiler);
    }

    async buildFetchModule() {
        const { inputFileSystem, hooks } = this.compiler;
        const { dirs, context, virtualModules } = this.opts;

        // Iterate through every module which declares the i18n specialFlag along with the context venia-concept dir
        const locales = {};
        for (const dir of dirs) {
            const localeDir = path.join(dir, i18nDir);
            try {
                const stats = inputFileSystem.statSync(localeDir);

                if (stats.isDirectory()) {
                    const packageTranslations = await this.findTranslationFiles(
                        inputFileSystem,
                        localeDir
                    );
                    this.mergeLocales(locales, packageTranslations);
                } else {
                    throw new Error('Path is not directory.');
                }
            } catch (e) {
                debug(`${dir} produced an error, this may not be an issue`, e);

                // If the directory declares i18n support, but doesn't contain the directory error the build
                if (dir !== context) {
                    throw new Error(
                        `${dir} module has i18n special flag, but i18n directory does not exist at ${localeDir}.`
                    );
                }
            }
        }

        if (Object.keys(locales).length === 0) {
            debug(
                'No locales found while traversing all modules with i18n flag.'
            );

            return;
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
         * Build up our importer factory, this provides a global function called __fetchLocaleData__ which in turn
         * completes a dynamic import of the combined file generated in the step above.
         * @type {string}
         */
        const importerFactory = `function () {
            return async function getLocale(locale) {
                ${Object.keys(locales)
                    .map(locale => {
                        return `if (locale === "${locale}") {
                        return import(/* webpackChunkName: "i18n-${locale}" */'${
                            mergedLocalesPaths[locale]
                        }');
                    }`;
                    })
                    .join('')}

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
                if (chunk.name && chunk.name.startsWith('i18n')) {
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

        return `;globalThis.__fetchLocaleData__ = (${importerFactory})()`;
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

        debug('Finished scanning for translation files.', locales);

        const combinedLocale = {};

        for (const locale of Object.keys(locales)) {
            debug(`Combining locale for ${locale}`);
            const files = locales[locale];
            let translationCount = 0;
            let combined = {};
            for (const file of files) {
                const data = inputFileSystem.readFileSync(file, 'utf8');
                if (data) {
                    const jsonData = JSON.parse(data);
                    translationCount += Object.keys(jsonData).length;
                    combined = merge.recursive(combined, jsonData);

                    // Check to see if we overwrote any keys during our merge
                    if (translationCount > Object.keys(combined).length) {
                        debug(
                            `${file} has ${translationCount -
                                Object.keys(combined).length} override(s).`
                        );

                        // Set the counter to only debug on the next iteration if new keys get overridden
                        translationCount = Object.keys(combined).length;
                    }
                }
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
            debug(`Scanning ${dir} for matching translation files.`);
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
                        } else if (item.stats.isFile()) {
                            debug(
                                `Found invalid item within i18n directory: ${
                                    item.path
                                }. File names should match locales such as en_US and have a .json extension.`
                            );
                        }
                    }
                })
                .on('error', done)
                .on('end', done);
        });
    }
}

module.exports = LocalizationPlugin;
