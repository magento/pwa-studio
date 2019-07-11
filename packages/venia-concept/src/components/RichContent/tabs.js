import React, { Children } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import defaultClasses from './tabs.css';
import { mergeClasses } from '../../classify';

const PageBuilderTabs = props => {
    const {
        children,
        data: {
            elements: { navigation },
            element: { domAttributes: tabsProps }
        }
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ children: tabNodes, domAttributes: tabListProps }] = navigation;
    const tabs = tabNodes.map(
        ({ children: tabChildren, domAttributes: tabProps }, index) => {
            const title = tabChildren[0].children[0].children[0];
            return (
                <Tab {...tabProps} className={classes.tab} key={index}>
                    {title}
                </Tab>
            );
        }
    );
    return (
        <Tabs
            {...tabsProps}
            className={classes.root}
            disabledTabClassName={classes.tabDisabled}
            selectedTabClassName={classes.tabSelected}
        >
            <TabList {...tabListProps} className={classes.tabList}>
                {tabs}
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
        </Tabs>
    );
};

export default PageBuilderTabs;
