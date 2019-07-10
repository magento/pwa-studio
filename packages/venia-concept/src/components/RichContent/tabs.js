import React from 'react';
import { Tabs, TabList, Tab } from 'react-tabs';

const PageBuilderTabs = props => {
    const {
        children,
        data: {
            elements: { navigation },
            ...tabsProps
        }
    } = props;
    const { children: tabNodes, ...tabListProps } = navigation[0];
    const tabs = tabNodes.map(({ children: tabChildren, ...tabProps }) => {
        const [title] = tabChildren[0];
        return <Tab {...tabProps}>{title}</Tab>;
    });
    return (
        <Tabs {...tabsProps}>
            <TabList {...tabListProps}>{tabs}</TabList>
            {children}
        </Tabs>
    );
};

export default PageBuilderTabs;
