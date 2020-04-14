const fs = require('fs');
const Parser = require('i18next-scanner').Parser;
const { resolve } = require('path');
const graphql = require('../Utilities/graphQL');
const prettyLogger = require('../util/pretty-logger');

const loadEnvironment = require('../Utilities/loadEnvironment');

module.exports.command = 'parse-translations <directory>';

module.exports.describe =
    'Load and validate the current environment, including .env file if present, to ensure all required configuration is in place.';

module.exports.builder = {
    coreDevMode: {
        type: 'boolean',
        desc:
            'For core @magento/pwa-studio repository development. Creates a .env file populated with examples if one is not present.'
    }
};

module.exports.handler = function buildpackCli(
    { directory }
) {
    const projectRoot = resolve(directory);
    const projectConfig = loadEnvironment(projectRoot);
    const config = projectConfig.section('MAGENTO_BACKEND');
    process.env.MAGENTO_BACKEND_URL = config.url;

    async function queryTranslations(locale, phrases) {
        return await graphql.getTranslations(locale, phrases);
    }

    async function queryAvailableLocales() {
        return await graphql.getAvailableLocales();
    }

    /** Results are our list of files we want to then extract phrases from */
    const results = [];

    /**
     * walk() function recursively identifies .js files in defined directory
     *
     * @param {string} dir
     */
    const walk = dir => {
        const list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = resolve(dir, file);

            if (checkExcludedDirs(file) === true) {
                return;
            }

            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                const newResults = walk(file);
                results.concat(newResults);
            } else {
                if (file.slice(-3) == '.js') {
                    results.push(file);
                }
            }
        });

        return results;
    };

    /**
     * Excluded specific directories from being parsed to save processing time
     * @param {string} fileName
     */
    const checkExcludedDirs = fileName => {
        let result = false;
        const excludedDirs = [
            '__mocks__',
            '__tests__',
            '__stories__',
            '/queries/'
        ];

        excludedDirs.forEach(function(element) {
            if (fileName.includes(element)) {
                result = true;
            }
        });

        return result;
    };

    /**
     * phrases object is collection of all parsed phrases in all directories
     */
    let phrases = {};

    /**
     * All directories we want to parse phrases for
     */
    const directories = [directory + '/src', '../venia-ui/lib'];

    /**
     * Retrieve phrases for each directory defined
     * Uses our walk() method from above
     */
    directories.forEach(function(element) {
        prettyLogger.info(`Retrieving phrases from ${element} directory`);
        walk(element);
    });

    prettyLogger.info('Extracting phrases from parsed files');
    const parser = new Parser();
    results.forEach(function(result) {
        parser.parseFuncFromString(fs.readFileSync(result), { list: ['_t'] });
    });

    let keys = [];
    try {
        phrases = parser.get().en.translation;
        keys = Object.keys(phrases);
        prettyLogger.info(
            `Phrase extraction complete. ${keys.length} phrases found.`
        );
    } catch (err) {
        prettyLogger.info('No translations found for ' + element);
    }

    /**
     * Fetch locales we should query for
     */
    queryAvailableLocales().then(response => {
        prettyLogger.info(
            'Fetched all available storeviews, processing each one'
        );
        response.forEach(function(element) {
            const localeLower = element.locale.toLowerCase();
            /**
             * Fetch the parsed phrases from the Magento Backend for each locale
             */
            queryTranslations(element.locale, keys).then(response => {
                prettyLogger.info(
                    `GraphQL Response successful for locale ${element.locale}`
                );

                const phrasesToOutput = {};
                response.forEach(function(phrase) {
                    /**
                     * Only write translations for phrases that are actually translated
                     */
                    if (phrase.original !== phrase.translated) {
                        Object.assign(phrasesToOutput, {
                            [phrase.original]: phrase.translated
                        });
                    }
                });

                const output = { translation: phrasesToOutput };
                /**
                 * Write JSON file to locale directory
                 * 1. Check if locale directory exists, create it if it doesn't
                 * 2. Write json file
                 */
                const outputDir = `${directory}/src/locales/${localeLower}`;
                if (!fs.existsSync(outputDir)) {
                    prettyLogger.warn(
                        `Locale directory for ${localeLower} does not exist, creating it`
                    );
                    fs.mkdirSync(outputDir);
                }

                prettyLogger.info(
                    `Writing translations file for ${localeLower}`
                );
                fs.writeFileSync(
                    `${outputDir}/remote.json`,
                    JSON.stringify(output)
                );
            });
        });
    });
};
