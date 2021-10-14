const { getColors } = require('./lib/colors');
const veniaPlugin = require('./plugins');

/**
 * This is the main tailwindcss theme file for the Venia theme
 */

module.exports = {
    important: '#root',
    plugins: [veniaPlugin],
    theme: {
        backgroundColor: theme => theme('colors'),
        borderColor: theme => theme('colors'),
        colors: getColors(),
        extend: {
            gridTemplateColumns: {},
            gridTemplateRows: {},
            lineHeight: {},
            maxHeight: {},
            maxWidth: {}
        },
        transitionDuration: {}
    }
};
