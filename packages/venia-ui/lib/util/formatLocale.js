/**
 * Convert locale from react-intl BCP 47 language code, to Magento standard
 *
 * @param {string} string
 * @returns {string} A locale string (e.g. `fr_FR`).
 */
export const fromReactIntl = string => {
    return string.replace('-', '_');
};

/**
 * Convert locale from Magento standard to react-intl BCP 47 language code
 *
 * @param {string} string
 * @returns {string} A string (e.g. `fr-FR`).
 */
export const toReactIntl = string => {
    return string.replace('_', '-');
};
