const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');
const walk = require('../../util/klaw-bound-fs');
const merge = require('merge');
const fs = require('fs');
const rimraf = require("rimraf");
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
        const { context, dirs } = this.opts;

        const distDirectory = path.join(context, 'i18n', 'dist');
        rimraf.sync(distDirectory);

        let locales = {};
        for (const dir of dirs) {
            const localeDir = `${dir}/${i18nDir}`;
            if (fs.existsSync(localeDir)) {
                const packageTranslations = await this.findTranslationFiles(this.compiler, localeDir);
                locales = this.mergeTranslationFiles(locales, packageTranslations);
            }
        }

        // Make our dist directory
        fs.mkdirSync(distDirectory, { recursive: true });

        debug('Located all translation files.', locales);

        const combinedPaths = {};

        for (const locale of Object.keys(locales)) {
            debug(`Combining locale for ${locale}`);
            const files = locales[locale];
            let combined = {};
            for (const file of files) {
                const data = fs.readFileSync(file, 'utf8');
                combined = merge.recursive(combined, JSON.parse(data));
            }

            const localePath = path.join(distDirectory, `${locale}.json`);
            fs.writeFileSync(
                localePath,
                JSON.stringify(combined)
            );
            combinedPaths[locale] = localePath;
        }

        const importerFactory = `function () {
            return function getLocale(locale) {
                ${Object.keys(locales).map((combinedLocale) => {
                    return `if (locale === "${combinedLocale}") { return import(/* webpackChunkName: "i18n" */'${combinedPaths[combinedLocale]}') }`;
                })}
                
                throw new Error('Unable to locate locale ' + locale + ' within generated dist directory.');
            }
        }`;

        return `;window.fetchLocaleData = (${importerFactory})()`;
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
     * @param compiler
     * @param dir
     * @returns {Promise<object>}
     */
    findTranslationFiles(compiler, dir) {
        return new Promise(resolve => {
            const translations = {};
            const done = () => resolve(translations);
            walk(dir, { fs: compiler.inputFileSystem })
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
