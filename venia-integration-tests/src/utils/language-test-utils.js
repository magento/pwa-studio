import { franc } from 'franc-min';

/**
 * Function to validate text language using franc (https://github.com/wooorm/franc)
 *
 * @param {String} text -- text to validate language
 * @param {String} language -- language to validate against franc (ISO639 codes only https://iso639-3.sil.org/code_tables/639/data)
 * @param {Object} options franc options
 */
export function validateLanguage(text, language, options) {
    const languageToCheck = franc(text, {
        only: ['eng', 'fra'],
        ...options
    });
    return languageToCheck === language;
}
