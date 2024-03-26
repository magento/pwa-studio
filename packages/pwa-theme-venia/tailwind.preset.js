// TODO @TW: see bottom too
//const aspectRatioPlugin = require('@tailwindcss/aspect-ratio');
const { getColors } = require('./lib/colors');
const corePlugin = require('./plugins');

const colors = {
    brand: {
        base: '61 132 255',
        dark: '41 84 255',
        darkest: '23 43 196',
        light: '194 200 255',
        100: '194 200 255',
        400: '61 132 255',
        // 500: '51 109 255',
        600: '41 84 255',
        700: '31 57 255',
        800: '23 43 196'
    }
};

const extend = {
    alignContent: {
        stretch: 'stretch'
    },
    animation: {
        spin: 'spin 1920ms linear infinite'
    },
    backgroundColor: theme => ({
        body: '#FFF',
        header: '#FFF',
        subtle: theme('colors.gray.100'),
        disabledTile: '#f5f5f5'
    }),
    backgroundImage: theme => ({
        'gradient-radial': `radial-gradient(circle, ${theme(
            'colors.gray.100'
        )}, white)`,
        swatch: theme('colors.gray.100'),
        'swatch-selected': `linear-gradient(-45deg, rgba(0, 0, 0, 0.2), transparent), ${theme(
            'colors.gray.100'
        )}`
    }),
    borderColor: theme => ({
        button: theme('colors.gray.600'),
        error: theme('colors.red.400'),
        info: theme('colors.green.600'),
        input: theme('colors.gray.600'),
        light: theme('colors.gray.100'),
        shaded: {
            10: 'rgba(0, 0, 0, 0.1)',
            15: 'rgba(0, 0, 0, 0.15)',
            20: 'rgba(0, 0, 0, 0.2)'
        },
        strong: theme('colors.gray.800'),
        subtle: theme('colors.gray.300'),
        success: theme('colors.green.600'),
        warning: theme('colors.yellow.500')
    }),
    borderRadius: {
        // Primitive
        radius1: '4px',
        radius2: '8px',
        radius3: '100%'

        // Generic
        // TODO @TW: review. This causes error.
        // radiusBox: theme('borderRadius.radius2'),
        // radiusButton: theme('borderRadius.radius1'),
        // radiusInput: theme('borderRadius.radius1'),
    },
    borderWidth: {
        DEFAULT: '1px'
    },
    boxShadow: theme => ({
        buttonFocus: `-6px 6px ${theme('colors.brand.700')} / 0.3`,
        dialog: `1px 1px 5px ${theme('colors.gray.600')}`,
        headerTrigger: `0 4px ${theme('colors.brand.600')}`,
        inputFocus: `-6px 6px ${theme('colors.brand.100')}`,
        menu: '0 1px 3px rgba(0, 0, 0, 0.2)',
        modal: `1px 0 ${theme('colors.borderColor.subtle')}`,
        radioActive: `-3px 3px ${theme('colors.brand.100')}`,
        radioFocus: `-3px 3px ${theme('colors.brand.100')}`,
        thin: `0 1px ${theme('colors.gray.300')}`
    }),
    colors: getColors(colors),
    flex: {
        textInput: '0 0 100%'
    },
    fontFamily: {
        sans: ['Muli', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif']
    },
    fontSize: {
        '2xs': '0.6875rem', // 11px
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.25rem', // 18px
        xl: '1.5rem', // 24px
        '2xl': '2.125rem', // 34px
        '3xl': '3rem', // 48px
        '4xl': '3.75rem', // 60px
        '5xl': '6rem', // 96px
        inherit: 'inherit'
    },
    fontWeight: {
        DEFAULT: '300'
    },
    gridColumnEnd: {
        span1: 'span 1',
        span2: 'span 2'
    },
    // TODO @TW:
    // With Tailwind 3.0, write a plugin for this property.
    gridTemplateColumns: {
        auto: 'auto',
        autoAuto: 'auto auto',
        autoFirst: 'auto 1fr',
        autoLast: '1fr auto',
        carouselThumbnailList: 'repeat(auto-fit, 1rem)'
    },
    gridTemplateRows: {
        auto: 'auto',
        autoFirst: 'auto 1fr',
        autoLast: '1fr auto'
    },
    height: {
        fitContent: 'fit-content',
        minContent: 'min-content',
        unset: 'unset'
    },
    justifyContent: {
        stretch: 'stretch'
    },
    lineHeight: {
        DEFAULT: '1.5'
    },
    maxHeight: {
        modal: '90vh'
    },
    maxWidth: {
        modal: '360px',
        site: '1440px'
    },
    minHeight: {
        auto: 'auto'
    },
    minWidth: {
        auto: 'auto'
    },
    // TODO @TW: review. Use the abstracted values in code.
    opacity: {
        disabled: 50,
        mask: {
            dark: 90,
            light: 50
        }
    },
    order: {
        unset: 'unset'
    },
    spacing: {
        '2xs': '0.5rem',
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
        DEFAULT: '1.5rem',
        filterSidebarWidth: '325px',
        full: '100%'
    },
    textColor: theme => ({
        colorDefault: theme('colors.gray.900'), // TODO @TW naming collision: TW puts "fontSize" + "color" under "text-" prefix
        error: theme('colors.red.700'),
        subtle: theme('colors.gray.600'),
        DEFAULT: theme('colors.gray.900')
    }),
    width: {
        fit: 'fit-content'
    },
    zIndex: {
        behind: '-1',
        surface: '1',
        foreground: '10',
        button: '20',
        buttonHover: '21',
        buttonFocus: '22',
        dropdown: '23',
        header: '40',
        headerDropdown: '41',
        mask: '60',
        menu: '70',
        dialog: '80',
        toast: '90'
    }
};

const theme = {
    // Preserve Tailwind defaults + extend from this preset.
    extend,
    // Override Tailwind defaults and preset config.
    screens: {
        xs: '480px',
        sm: '640px',
        md: '800px',
        lg: '960px',
        xl: '1120px',
        '2xl': '1280px',
        '3xl': '1440px',
        '4xl': '1600px',
        max: '1920px'
    },
    transitionDuration: {
        xs: '64ms',
        sm: '128ms',
        md: '192ms',
        lg: '256ms',
        xl: '320ms',
        '2xl': '384ms',
        '3xl': '448ms',
        '4xl': '512ms',
        DEFAULT: '384ms',
        enter: '224ms',
        exit: '192ms'
    },
    venia: theme => ({
        plugins: {
            body: {
                color: theme('colors.neutral.900')
            },
            root: {
                colors
            }
        }
    })
};

const config = {
    // TODO @TW: see top too. Had to disable to get working locally.
    // plugins: [aspectRatioPlugin, corePlugin],
    plugins: [corePlugin],
    theme,
    variants: {
        extend: {
            backgroundColor: ['checked'],
            backgroundImage: ['focus'],
            borderColor: ['even'],
            borderStyle: ['even'],
            borderWidth: ['even', 'last'],
            boxShadow: ['active'],
            fontWeight: ['first'],
            outline: ['active', 'focus'],
            pointerEvents: ['disabled'],
            textColor: ['disabled', 'first']
        }
    }
};

module.exports = config;
