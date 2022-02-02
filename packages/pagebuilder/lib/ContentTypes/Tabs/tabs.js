import React, {
    Children,
    useRef,
    useEffect,
    useCallback,
    useState
} from 'react';
import {
    Tabs as TabWrapper,
    TabList,
    Tab as TabHeader,
    TabPanel
} from 'react-tabs';
import defaultClasses from './tabs.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useMediaQuery } from '@magento/peregrine/lib/hooks/useMediaQuery';
import { arrayOf, number, oneOf, shape, string, object } from 'prop-types';

/**
 * Upper case the first letter of a string
 *
 * @param {string} string
 * @returns {string}
 */
const upperCaseString = string => {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

/**
 * Page Builder Tabs component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Tabs
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a set of Tabs.
 */
const Tabs = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const navigationRef = useRef(null);
    const [scrollElement, setScrollElement] = useState(null);
    const [gradient, setGradient] = useState(null);
    const isScrolling = useRef(false);
    const clientX = useRef(0);
    const scrollX = useRef(0);

    const {
        tabNavigationAlignment = 'left',
        minHeight,
        defaultIndex = 0,
        headers = [],
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        mediaQueries,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        children
    } = props;

    const { styles: mediaQueryStyles } = useMediaQuery({ mediaQueries });

    const handleMouseDown = useCallback(event => {
        isScrolling.current = true;
        clientX.current = event.clientX;
    }, []);

    const handleMouseUp = useCallback(() => {
        isScrolling.current = false;
    }, []);

    const handleMouseMove = useCallback(
        event => {
            if (isScrolling.current && scrollElement) {
                scrollElement.scrollLeft =
                    scrollX.current + (clientX.current - event.clientX);
                scrollX.current = scrollElement.scrollLeft;
                clientX.current = event.clientX;
            }
        },
        [scrollElement]
    );

    const handleScroll = useCallback(
        event => {
            const navScrollElement = event.target;
            // Sync scrollLeft
            scrollX.current = event.target.scrollLeft;

            if (navScrollElement.scrollLeft > 0) {
                // If we've scrolled to the end of the scrollable element we only display a left gradient
                if (
                    navScrollElement.scrollLeft +
                        navScrollElement.offsetWidth +
                        1 >=
                    navScrollElement.scrollWidth
                ) {
                    setGradient('left');
                } else {
                    // While scrolling we show gradients on both sides
                    setGradient('both');
                }
            } else {
                setGradient('right');
            }
        },
        [setGradient]
    );

    useEffect(() => {
        let navScrollElement;
        const navigationWrapper = navigationRef.current;

        if (
            navigationWrapper &&
            navigationWrapper.childNodes[0].nodeName === 'UL'
        ) {
            navScrollElement = navigationWrapper.childNodes[0];
            setScrollElement(navScrollElement);
            // If there are additional tabs hidden by scroll we display a gradient on the right
            if (navScrollElement.scrollWidth > navScrollElement.offsetWidth) {
                setGradient('right');
            }
            navScrollElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (navScrollElement) {
                navScrollElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    if (!headers.length) {
        return null;
    }

    const wrapperStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const contentStyles = {
        minHeight,
        textAlign
    };

    const tabWrapperProps = {
        defaultIndex
    };

    if (border) {
        wrapperStyles['--tabs-border'] = border;
        wrapperStyles['--tabs-border-color'] = borderColor;
    }
    if (borderWidth) {
        wrapperStyles['--tabs-border-width'] = borderWidth;
    }
    if (borderRadius) {
        wrapperStyles['--tabs-border-radius'] = borderRadius;
    }

    const tabHeaders = headers.map((header, i) => (
        <TabHeader className={classes.header} key={i}>
            {header}
        </TabHeader>
    ));

    const tabPanels = Children.map(children, (child, index) => {
        return (
            <TabPanel
                key={index}
                className={classes.panel}
                selectedClassName={classes.panelSelected}
            >
                {child}
            </TabPanel>
        );
    });

    const navigationClass =
        classes[`navigation${upperCaseString(tabNavigationAlignment)}`];

    const contentClass =
        classes[`content${upperCaseString(tabNavigationAlignment)}`];

    const navigationWrapperClass = gradient
        ? classes[`navigationGradient${upperCaseString(gradient)}`]
        : null;

    return (
        <TabWrapper
            style={wrapperStyles}
            className={[classes.root, ...cssClasses].join(' ')}
            disabledTabClassName={classes.disabled}
            selectedTabClassName={classes.selected}
            {...tabWrapperProps}
        >
            <div className={navigationWrapperClass} ref={navigationRef}>
                <TabList
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                    className={navigationClass}
                >
                    {tabHeaders}
                </TabList>
            </div>
            <div
                className={contentClass}
                style={{ ...contentStyles, ...mediaQueryStyles }}
            >
                {tabPanels}
            </div>
        </TabWrapper>
    );
};

/**
 * Props for {@link Tabs}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Tabs
 * @property {String} classes.header Class names for the tab header
 * @property {String} classes.panelSelected Class names for the selected tab panel
 * @property {String} classes.panel Class names for the tab panel
 * @property {String} classes.contentLeft Class names for the tab content
 * @property {String} classes.contentCenter Class names for the tab content
 * @property {String} classes.contentRight Class names for the tab content
 * @property {String} classes.navigationLeft Class names for the tab navigation
 * @property {String} classes.navigationCenter Class names for the tab navigation
 * @property {String} classes.navigationRight Class names for the tab navigation
 * @property {String} classes.navigationGradientLeft Class names for the tab navigation gradient when scrolling
 * @property {String} classes.navigationGradientRight Class names for the tab navigation gradient when scrolling
 * @property {String} classes.navigationGradientBoth Class names for the tab navigation gradient when scrolling
 * @property {String} classes.disabled Class names for the disabled tabs
 * @property {String} classes.selected Class names for the selected tab
 * @property {String} classes.item Class names for the tab item
 * @property {String} tabNavigationAlignment Navigation alignment for tabs
 * @property {String} minHeight Minimum height of the tabs
 * @property {Number} defaultIndex Index of the tab to display by default
 * @property {Array} headers Array of tab headers
 * @property {String} textAlign Alignment of the Tabs within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {Array}  mediaQueries List of media query rules to be applied to the component
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Tabs.propTypes = {
    classes: shape({
        header: string,
        panelSelected: string,
        panel: string,
        contentLeft: string,
        contentCenter: string,
        contentRight: string,
        navigationLeft: string,
        navigationCenter: string,
        navigationRight: string,
        navigationGradientLeft: string,
        navigationGradientRight: string,
        navigationGradientBoth: string,
        disabled: string,
        selected: string,
        item: string
    }),
    tabNavigationAlignment: oneOf(['left', 'center', 'right']),
    minHeight: string,
    defaultIndex: number,
    headers: arrayOf(string),
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    mediaQueries: arrayOf(
        shape({
            media: string,
            style: object
        })
    ),
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Tabs;
