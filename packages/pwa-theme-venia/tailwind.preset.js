const { getColors } = require('./lib/colors');
/**
 * This is the main tailwindcss theme file for the Venia theme
 */

module.exports = {
    theme: {
        backgroundColor: {},
        borderColor: {},
        colors: getColors(),
        extend: {
            gridTemplateColumns: {},
            gridTemplateRows: {},
            lineHeight: {},
            maxHeight: {},
            maxWidth: {}
        },
        screens: {},
        transitionDuration: {}
    }
};
