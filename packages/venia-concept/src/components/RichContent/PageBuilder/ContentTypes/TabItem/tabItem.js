import React from 'react';
import { TabPanel } from 'react-tabs';
import defaultClasses from './tabItem.css';
import classify from 'src/classify';

const TabItem = ({classes, appearance, display, justifyContent, flexDirection, backgroundPosition, backgroundSize, backgroundRepeat, backgroundAttachment, borderWidth, borderRadius, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft, children}) => {
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

export default classify(defaultClasses)(TabItem);
