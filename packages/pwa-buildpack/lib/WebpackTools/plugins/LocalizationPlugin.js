const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');
const walk = require('../../util/klaw-bound-fs');
const merge = require('merge');
const InjectPlugin = require('webpack-inject-plugin').default;

const i18nDir = 'i18n';
const localeFileNameRegex = /([a-z]{2}_[A-Z]{2})\.json$/;

/**
 * Localization Plugin to collect all translations from NPM modules and create single translation file for each locale
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
        debug('applying InjectPlugin to create global');
        new InjectPlugin(() => this.buildFetchModule()).apply(this.compiler);
    }

    async buildFetchModule() {
        const { outputFileSystem, inputFileSystem } = this.compiler;
        const { dirs, context, cleanup } = this.opts;

        let locales = {};
        for (const dir of dirs) {
            const localeDir = path.join(dir, i18nDir);
            try {
                const stats = inputFileSystem.statSync(localeDir);

                if (stats.isDirectory()) {
                    const packageTranslations = await this.findTranslationFiles(inputFileSystem, localeDir);
                    locales = this.mergeTranslationFiles(locales, packageTranslations);
                }
            }
            catch (e) {
                console.error(e);
                debug(e);
            }
        }

        if (!locales) {
            debug('No locales found while traversing all modules with i18n flag.');
        }

        // Merge all located translation files together and return their paths for a dynamic import
        const mergedLocalesPaths = await this.writeMergedLocales(context, locales, inputFileSystem, outputFileSystem);

        debug('Merged locales into path.', mergedLocalesPaths);

        // Build our importer factory up
        const importerFactory = `function () {
            return function getLocale(locale) {
                ${Object.keys(locales).map((locale) => {
                return `if (locale === "${locale}") { return import(/* webpackChunkName: "i18n" */'${mergedLocalesPaths[locale]}') }`;
            })}
                
                throw new Error('Unable to locate locale ' + locale + ' within generated dist directory.');
            }
        }`;

        // Once the process has completed and clean up is enabled, remove up our merged build files
        if (cleanup) {
            this.compiler.hooks.afterEmit.tapAsync('LocalizationPlugin', async (compilation, callback) => {
                await Promise.all(Object.values(mergedLocalesPaths).map((path) => {
                    return new Promise((resolve) => {
                        outputFileSystem.unlink(path, resolve);
                    });
                }));

                callback();
            });
        }

        return `;window.fetchLocaleData = (${importerFactory})()`;
    }

    /**
     *
     * @param context
     * @param locales
     * @param inputFileSystem
     * @param outputFileSystem
     * @returns {Promise<void>}
     */
    async writeMergedLocales(context, locales, inputFileSystem, outputFileSystem) {
        const distDirectory = context;

        debug('Located all translation files.', locales);

        const writePromises = [];
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
            writePromises.push(new Promise((resolve) => {
                outputFileSystem.writeFile(
                    localePath,
                    JSON.stringify(combined),
                    () => {
                        combinedLocale[locale] = localePath;
                        resolve(localePath);
                    }
                );
            }));
        }

        await Promise.all(writePromises);

        return combinedLocale;
    }

    /**
     * Merge translation file strings into their respective locales
     *
     * @param current
     * @param update
     * @returns {*}
     */
    mergeTranslationFiles(current, update) {
        Object.keys(update).forEach((key) => {
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
                            const localeMatch = item.path.match(localeFileNameRegex);
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
        })
    }
}

module.exports = LocalizationPlugin;
