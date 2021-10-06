const { getColors } = require('./lib/colors');
const veniaPlugin = require('./plugins');
/**
 * This is the main tailwindcss theme file for the Venia theme
 */

module.exports = {
    plugins: [veniaPlugin],
    theme: {
        backgroundColor: theme => theme('colors'),
        borderColor: theme => theme('colors'),
        colors: getColors(),
        fontFamily: {
            sans: ['Muli', 'sans-serif'],
            serif: ['Source Serif Pro', 'serif']
        },
        extend: {
            zIndex: {
                3: '3',
                11: '11'
            },
            spacing: {
                16: '16px',
                32: '32px'
            },
            gridTemplateColumns: {},
            gridTemplateRows: {
                header: '5rem'
            },
            lineHeight: {},
            maxHeight: {},
            minHeight: {
                header: '5rem'
            },
            maxWidth: {
                desktop: '1440px'
            }
        },
        screens: {
            tablet: '640px',
            // => @media (min-width: 640px) { ... }

            laptop: '1024px',
            // => @media (min-width: 1024px) { ... }

            desktop: '1280px'
            // => @media (min-width: 1280px) { ... }
        },
        transitionDuration: {}
    }
};
