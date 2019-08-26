import React from 'react';
import { Tabs as TabWrapper, TabList, Tab as TabHeader } from 'react-tabs';
import tabsClasses from './tabs.css';
import classify from 'src/classify';
import defaultClasses from "../Column/column.css";

const Tabs = ({classes, appearance, verticalAlignment, minHeight, defaultIndex, headers, navigation, border, borderColor, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, cssClasses, children}) => {
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
                className={[...navigation.cssClasses, classes.tabList].join(' ')}
            >
                {headers.map((header, i) => (
                    <TabHeader
                        key={i}
                    >
                        {header}
                    </TabHeader>
                ))}
            </TabList>
            {children}
        </TabWrapper>
    );
};

export default classify(defaultClasses)(Tabs);
