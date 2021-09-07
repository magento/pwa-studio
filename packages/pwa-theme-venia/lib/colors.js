const COLORS = require('../data/colors');

const PREFIX = '--color';

/**
 * create a custom property declaration for each color-weight
 * these declarations *write* values to custom properties
 *
 * @param {object} data color palette definition data
 * @param {string} prefix custom property (variable) prefix
 *
 * @returns {object} a generated list of color definitions based on the data
 */
const declareColors = (data = COLORS, prefix = PREFIX) => {
    const declarations = {};

    for (const [color, definition] of Object.entries(data)) {
        if (typeof definition === 'string') {
            declarations[`${prefix}-${color}`] = definition;
        } else {
            for (const [weight, value] of Object.entries(definition)) {
                declarations[`${prefix}-${color}-${weight}`] = value;
            }
        }
    }

    return declarations;
};

/**
 * create color-weight functions for export to `tailwind.preset.js`
 * these functions *read* values from custom properties
 *
 * @param {object} data color palette definition data
 * @param {string} prefix custom property (variable) prefix
 *
 * @returns {object} color configuration data for tailwind
 */
const getColors = (data = COLORS, prefix = PREFIX) => {
    const colors = {};

    for (const [color, definition] of Object.entries(data)) {
        if (typeof definition === 'string') {
            const property = `${prefix}-${color}`;
            colors[color] = getPropertyValueFunction(property);
        } else {
            const functions = {};

            for (const [weight] of Object.entries(definition)) {
                const property = `${prefix}-${color}-${weight}`;
                functions[weight] = getPropertyValueFunction(property);
            }
            colors[color] = functions;
        }
    }

    return colors;
};

/**
 * @ignore
 *
 * helper function for generating the proper function for returning
 * the correct property value for a color entry
 *
 * @param {string} property property variable name
 *
 * @returns {function} a function that generates the correct property value for a color entry
 */
const getPropertyValueFunction = property => {
    return opacityArgs => {
        const { opacityVariable, opacityValue } = opacityArgs;

        return opacityValue != null
            ? `rgb(var(${property}) / ${opacityValue})`
            : opacityVariable != null
            ? `rgb(var(${property}) / var(${opacityVariable}, 1))`
            : `rgb(var(${property}))`;
    };
};

module.exports = { declareColors, getColors };
