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

    for (const [color, weights] of Object.entries(data)) {
        for (const [weight, value] of Object.entries(weights)) {
            declarations[`${prefix}-${color}-${weight}`] = value;
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

    for (const [color, weights] of Object.entries(data)) {
        const functions = {};

        for (const [weight] of Object.entries(weights)) {
            functions[weight] = opacityArgs => {
                const { opacityVariable, opacityValue } = opacityArgs;
                const property = `${prefix}-${color}-${weight}`;

                return opacityValue != null
                    ? `rgb(var(${property}) / ${opacityValue})`
                    : opacityVariable != null
                    ? `rgb(var(${property}) / var(${opacityVariable}, 1))`
                    : `rgb(var(${property}))`;
            };
        }

        colors[color] = functions;
    }

    return colors;
};

module.exports = { declareColors, getColors };
