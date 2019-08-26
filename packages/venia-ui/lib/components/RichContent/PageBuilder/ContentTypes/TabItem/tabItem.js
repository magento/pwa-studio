import React from 'react';
import { TabPanel } from 'react-tabs';
import defaultClasses from './tabItem.css';
import {mergeClasses} from "../../../../../classify";

const TabItem = ({classes, display, justifyContent, flexDirection, backgroundPosition, backgroundSize, backgroundRepeat, backgroundAttachment, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, children}) => {
    classes = mergeClasses(defaultClasses, classes);
    const dynamicStyles = {
        display,
        justifyContent,
        flexDirection,
        backgroundPosition,
        backgroundSize,
        backgroundRepeat,
        backgroundAttachment,
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

    return (
        <TabPanel
            className={classes.tabPanel}
            selectedClassName={classes.tabPanelSelected}
            style={dynamicStyles}
        >
            {children}
        </TabPanel>
    );
};

export default TabItem;
