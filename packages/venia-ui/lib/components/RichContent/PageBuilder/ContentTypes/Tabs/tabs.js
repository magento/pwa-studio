import React, { Children } from 'react';
import {
    Tabs as TabWrapper,
    TabList,
    Tab as TabHeader,
    TabPanel
} from 'react-tabs';
import defaultClasses from './tabs.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, number, oneOf, shape, string } from 'prop-types';

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
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        tabNavigationAlignment,
        verticalAlignment,
        minHeight,
        defaultIndex,
        headers,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        children
    } = props;

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
        verticalAlignment,
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

    const tabPanels = Children.map(children, (child, index) => {
        return (
            <TabPanel
                key={index}
                className={classes.tabPanel}
                selectedClassName={classes.tabPanelSelected}
            >
                {child}
            </TabPanel>
        );
    });

    cssClasses.push(classes.root);

    const navigationClass =
        classes[
            `tabNavigation${tabNavigationAlignment.charAt(0).toUpperCase() +
                tabNavigationAlignment.slice(1)}`
        ];

    const contentClass =
        classes[
            `tabContent${tabNavigationAlignment.charAt(0).toUpperCase() +
            tabNavigationAlignment.slice(1)}`
            ];

    return (
        <TabWrapper
            style={wrapperStyles}
            className={[...cssClasses].join(' ')}
            disabledTabClassName={classes.tabDisabled}
            selectedTabClassName={classes.tabSelected}
            {...tabWrapperProps}
        >
            <TabList className={navigationClass}>
                {headers.map((header, i) => (
                    <TabHeader className={classes.tabHeader} key={i}>
                        {header}
                    </TabHeader>
                ))}
            </TabList>
            <div className={contentClass} style={contentStyles}>
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
 * @property {String} classes.tabHeader Class names for the tab header
 * @property {String} classes.tabPanelSelected Class names for the selected tab panel
 * @property {String} classes.tabPanel Class names for the tab panel
 * @property {String} classes.tabContent Class names for the tab content
 * @property {String} classes.tabNavigation Class names for the tab navigation
 * @property {String} classes.tabDisabled Class names for the disabled tabs
 * @property {String} classes.tabSelected Class names for the selected tab
 * @property {String} classes.tabItem Class names for the tab item
 * @property {String} verticalAlignment Vertical alignment of the Tabs within the parent container
 * @property {String} minHeight Minimum height of the tabs
 * @property {String} defaultIndex Index of the tab to display by default
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
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Tabs.propTypes = {
    classes: shape({
        tabHeader: string,
        tabPanelSelected: string,
        tabPanel: string,
        tabContent: string,
        tabNavigationLeft: string,
        tabNavigationCenter: string,
        tabNavigationRight: string,
        tabDisabled: string,
        tabSelected: string,
        tabItem: string
    }),
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
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
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Tabs;
