import React, { Children } from 'react';
import { Tabs as TabWrapper, TabList, Tab as TabHeader, TabPanel } from 'react-tabs';
import defaultClasses from "./tabs.css";
import {mergeClasses} from "../../../../../classify";

const Tabs = ({classes, verticalAlignment, minHeight, defaultIndex, headers, navigation, content, border, borderColor, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, cssClasses, children}) => {
    classes = mergeClasses(defaultClasses, classes);
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
                className={[...navigation.cssClasses, classes.tabNavigation].join(' ')}
                style={navigation.style}
            >
                {headers.map((header, i) => (
                    <TabHeader
                        className={classes.tabHeader}
                        key={i}
                    >
                        {header}
                    </TabHeader>
                ))}
            </TabList>
            <div className={classes.tabContent} style={content.style}>
                {Children.map(children, (child, index) => {
                    const data = child.props.data;

                    const tabPanelDynamicStyles = Object.fromEntries([
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
                    ].map(val => [val, data[val]]));

                    return (
                        <TabPanel
                            key={index}
                            className={classes.tabPanel}
                            selectedClassName={classes.tabPanelSelected}
                            style={tabPanelDynamicStyles}
                        >
                            {child}
                        </TabPanel>
                    )
                })}
            </div>
        </TabWrapper>
    );
};

export default Tabs;
