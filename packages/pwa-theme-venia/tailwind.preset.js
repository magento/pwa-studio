const { getColors } = require('./lib/colors');
const veniaPlugin = require('./plugins');

/**
 * This is the main tailwindcss theme file for the Venia theme
 */

module.exports = {
    theme: {
        plugins: [veniaPlugin],
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
        screens: {
            tablet: '640px',
            laptop: '1024px',
            desktop: '1280px'
        },
        transitionDuration: {}
    }
};
