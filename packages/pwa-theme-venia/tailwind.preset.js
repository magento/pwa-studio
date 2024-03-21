// TODO @TW: see bottom too
//const aspectRatioPlugin = require('@tailwindcss/aspect-ratio');
const { getColors, hexToRgb } = require('./lib/colors');
const corePlugin = require('./plugins');
const defaultTheme = require('tailwindcss/defaultTheme');

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
        spin: 'spin 1920ms linear infinite',
        shimmer: 'shimmer 1s linear infinite forwards'
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
        )}`,
        shimmer: `linear-gradient(
            to right,
            ${theme('colors.gray.50/0')} 0%,
            ${theme('colors.gray.50')} 40%,
            ${theme('colors.gray.50/0')} 80%,
            ${theme('colors.gray.50/0')} 100%
        )`
    }),
    backgroundSize: theme => ({
        maxSite: `${theme('maxWidth.site')} 100%`
    }),
    borderColor: theme => ({
        currentColor: 'currentColor',
        button: theme('colors.gray.600'),
        error: theme('colors.red.400'),
        info: theme('colors.green.600'),
        input: theme('colors.gray.600'),
        inputFocus: theme('colors.gray.700'),
        light: theme('colors.gray.100'),
        shaded: {
            10: 'rgba(0, 0, 0, 0.1)',
            15: 'rgba(0, 0, 0, 0.15)',
            20: 'rgba(0, 0, 0, 0.2)'
        },
        strong: theme('colors.gray.800'),
        swatch: theme('colors.gray.400'),
        base: theme('colors.gray.400'),
        subtle: theme('colors.gray.300'),
        success: theme('colors.green.600'),
        warning: theme('colors.yellow.500')
    }),
    borderRadius: {
        // Primitive
        radius1: '4px',
        radius2: '8px',
        radius3: '100%',
        box: defaultTheme.borderRadius.md,
        button: defaultTheme.borderRadius.full,
        input: defaultTheme.borderRadius.md,
        badge: defaultTheme.borderRadius.md
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
    content: {
        empty: ''
    },
    flex: {
        textInput: '0 0 100%'
    },
    fontFamily: {
        sans: ['Muli', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif']
    },
    fontSize: {
        '2xs': ['0.6875rem', '1.5'], // 11px
        xs: ['0.75rem', '1.5'], // 12px
        sm: ['0.875rem', '1.5'], // 14px
        base: ['1rem', '1.5'], // 16px
        lg: ['1.25rem', '1.5'], // 18px
        xl: ['1.5rem', '1.5'], // 24px
        '2xl': ['2.125rem', '1.5'], // 34px
        '3xl': ['3rem', '1.5'], // 48px
        '4xl': ['3.75rem', '1.5'], // 60px
        '5xl': ['6rem', '1'], // 96px
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
    keyframes: {
        shimmer: {
            '0%': {
                transform: 'translateX(-100%)'
            },
            '100%': {
                transform: 'translateX(100%)'
            }
        }
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
    minHeight: theme => ({
        auto: 'auto',
        4: theme('spacing.4')
    }),
    minWidth: theme => ({
        auto: 'auto',
        32: theme('spacing.32')
    }),
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
        full: '100%',
        header: '5rem',
        '7.5': '1.875rem',
        '100vw': '100vw',
        '75vw': '75vw',
        '50vw': '50vw',
        '25vw': '25vw'
    },
    textColor: theme => ({
        colorDefault: theme('colors.gray.900'), // TODO @TW naming collision: TW puts "fontSize" + "color" under "text-" prefix
        error: theme('colors.red.700'),
        subtle: theme('colors.gray.600'),
        DEFAULT: theme('colors.gray.900')
    }),
    width: theme => ({
        fit: 'fit-content',
        swatch: '3.875rem',
        maxSite: theme('maxWidth.site')
    }),
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
        '-xs': {
            max: '479px'
        },
        sm: '640px',
        '-sm': {
            max: '639px'
        },
        hsm: {
            raw: '(min-height: 640px)'
        },
        '-hsm': {
            raw: '(max-height: 639px)'
        },
        md: '800px',
        '-md': {
            max: '799px'
        },
        hmd: {
            raw: '(min-height: 800px)'
        },
        '-hmd': {
            raw: '(max-height: 799px)'
        },
        lg: '960px',
        '-lg': {
            max: '959px'
        },
        hlg: {
            raw: '(min-height: 960px)'
        },
        '-hlg': {
            raw: '(max-height: 959px)'
        },
        xl: '1024px',
        '-xl': {
            max: '1023px'
        },
        '2xl': '1280px',
        '-2xl': {
            max: '-1279px'
        },
        '3xl': '1440px',
        '-3xl': {
            max: '-1439px'
        },
        '4xl': '1600px',
        '-4xl': {
            max: '1599px'
        },
        max: '1920px',
        '-max': {
            max: '1920px'
        }
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
                colors: {
                    ...colors,
                    blue: {
                        100: hexToRgb(theme('colors.blue.100')),
                        400: hexToRgb(theme('colors.blue.400')),
                        700: hexToRgb(theme('colors.blue.700'))
                    },
                    gray: {
                        50: hexToRgb(theme('colors.gray.50')),
                        100: hexToRgb(theme('colors.gray.100')),
                        300: hexToRgb(theme('colors.gray.300')),
                        400: hexToRgb(theme('colors.gray.400')),
                        500: hexToRgb(theme('colors.gray.500')),
                        600: hexToRgb(theme('colors.gray.600')),
                        700: hexToRgb(theme('colors.gray.700')),
                        900: hexToRgb(theme('colors.gray.900'))
                    },
                    green: {
                        600: hexToRgb(theme('colors.green.600'))
                    },
                    orange: hexToRgb(theme('colors.amber.500')),
                    red: {
                        400: hexToRgb(theme('colors.red.400')),
                        700: hexToRgb(theme('colors.red.700'))
                    }
                }
            }
        }
    })
};

const config = {
    // TODO @TW: see top too. Had to disable to get working locally.
    // plugins: [aspectRatioPlugin, corePlugin],
    plugins: [corePlugin],
    theme
};

module.exports = config;
