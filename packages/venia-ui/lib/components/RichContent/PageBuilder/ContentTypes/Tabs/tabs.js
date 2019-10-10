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
        verticalAlignment,
        minHeight,
        defaultIndex,
        headers,
        navigation,
        content,
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
        cssClasses,
        children
    } = props;

    const tabWrapperDynamicStyles = {
        verticalAlignment,
        minHeight,
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
        paddingLeft
    };

    const tabWrapperProps = {
        defaultIndex
    };

    cssClasses.push(classes.root);

    return (
        <TabWrapper
            style={tabWrapperDynamicStyles}
            className={[...cssClasses].join(' ')}
            disabledTabClassName={classes.tabDisabled}
            selectedTabClassName={classes.tabSelected}
            {...tabWrapperProps}
        >
            <TabList
                className={[
                    ...navigation.cssClasses,
                    classes.tabNavigation
                ].join(' ')}
                style={navigation.style}
            >
                {headers.map((header, i) => (
                    <TabHeader className={classes.tabHeader} key={i}>
                        {header}
                    </TabHeader>
                ))}
            </TabList>
            <div className={classes.tabContent} style={content.style}>
                {Children.map(children, (child, index) => {
                    const data = child.props.data;

                    const tabPanelDynamicStyles = Object.fromEntries(
                        [
                            'verticalAlignment',
                            'display',
                            'justifyContent',
                            'flexDirection',
                            'backgroundRepeat',
                            'backgroundSize',
                            'backgroundPosition',
                            'backgroundAttachment',
                            'backgroundRepeat',
                            'minHeight',
                            'border',
                            'borderColor',
                            'borderWidth',
                            'borderRadius',
                            'marginTop',
                            'marginRight',
                            'marginBottom',
                            'marginLeft',
                            'paddingTop',
                            'paddingRight',
                            'paddingBottom',
                            'paddingLeft'
                        ].map(val => [val, data[val]])
                    );

                    return (
                        <TabPanel
                            key={index}
                            className={classes.tabPanel}
                            selectedClassName={classes.tabPanelSelected}
                            style={tabPanelDynamicStyles}
                        >
                            {child}
                        </TabPanel>
                    );
                })}
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
 * @property {Object} navigation Object containing the configuration for the tab navigation
 * @property {Object} navigation.style Object containing the styling for the tab navigation
 * @property {String} navigation.style.textAlign Alignment of the navigation
 * @property {String} navigation.style.border CSS border property
 * @property {String} navigation.style.borderColor CSS border color property
 * @property {String} navigation.style.borderWidth CSS border width property
 * @property {String} navigation.style.borderRadius CSS border radius property
 * @property {String} navigation.style.marginTop CSS margin top property
 * @property {String} navigation.style.marginRight CSS margin right property
 * @property {String} navigation.style.marginBottom CSS margin bottom property
 * @property {String} navigation.style.marginLeft CSS margin left property
 * @property {String} navigation.style.paddingTop CSS padding top property
 * @property {String} navigation.style.paddingRight CSS padding right property
 * @property {String} navigation.style.paddingBottom CSS padding bottom property
 * @property {String} navigation.style.paddingLeft CSS padding left property
 * @property {Array} navigation.cssClasses List of CSS classes to be applied to the component
 * @property {Object} content Object containing the configuration for the tab content
 * @property {Object} content.style Object containing the styling for the tab content
 * @property {String} content.style.textAlign Alignment of the content within the parent container
 * @property {String} content.style.border CSS border property
 * @property {String} content.style.borderColor CSS border color property
 * @property {String} content.style.borderWidth CSS border width property
 * @property {String} content.style.borderRadius CSS border radius property
 * @property {String} content.style.marginTop CSS margin top property
 * @property {String} content.style.marginRight CSS margin right property
 * @property {String} content.style.marginBottom CSS margin bottom property
 * @property {String} content.style.marginLeft CSS margin left property
 * @property {String} content.style.paddingTop CSS padding top property
 * @property {String} content.style.paddingRight CSS padding right property
 * @property {String} content.style.paddingBottom CSS padding bottom property
 * @property {String} content.style.paddingLeft CSS padding left property
 * @property {Array} content.cssClasses List of CSS classes to be applied to the component
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
        tabNavigation: string,
        tabDisabled: string,
        tabSelected: string,
        tabItem: string
    }),
    verticalAlignment: oneOf(['top', 'middle', 'bottom']),
    minHeight: string,
    defaultIndex: number,
    headers: arrayOf(string),
    navigation: shape({
        style: shape({
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
            paddingLeft: string
        }),
        cssClasses: arrayOf(string)
    }),
    content: shape({
        style: shape({
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
            paddingLeft: string
        })
    }),
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
