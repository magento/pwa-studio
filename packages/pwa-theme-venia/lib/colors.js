const COLORS = require('../data/colors');

const PREFIX = '--color';

/**
 * create color-weight functions for export to `tailwind.preset.js`
 * these functions *read* values from custom properties
 */
const getColors = (colors = COLORS, prefix = PREFIX) => {
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

module.exports = { getColors };
