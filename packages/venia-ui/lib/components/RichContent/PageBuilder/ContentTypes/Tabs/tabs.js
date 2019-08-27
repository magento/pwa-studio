import React, { Children } from 'react';
import {
    Tabs as TabWrapper,
    TabList,
    Tab as TabHeader,
    TabPanel
} from 'react-tabs';
import defaultClasses from './tabs.css';
import { mergeClasses } from '../../../../../classify';

const Tabs = ({
    classes,
    verticalAlignment,
    minHeight,
    defaultIndex,
    headers,
    navigation,
    items,
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
}) => {
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
                className={[...navigation.cssClasses, classes.tabList].join(
                    ' '
                )}
            >
                {headers.map((header, i) => (
                    <TabHeader key={i}>{header}</TabHeader>
                ))}
            </TabList>
            {Children.map(children, (child, index) => (
                <TabPanel
                    key={index}
                    className={classes.tabPanel}
                    selectedClassName={classes.tabPanelSelected}
                >
                    {child}
                </TabPanel>
            ))}
        </TabWrapper>
    );
};

export default Tabs;
