import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import tabsClasses from './tabs.css';
import RichContent from './richContent';
import GenericElement from './genericElement';

const PageBuilderTabs = ({ data }) => {
    const tabsProps = data.element.domAttributes;
    const tabs = data.elements.headers.map(
        (tabHeader, index) => (
            <Tab {...tabHeader.domAttributes} className={tabHeader.domAttributes.className + ' ' + tabsClasses.tab} key={index}>
                <RichContent data={tabHeader.children} />
            </Tab>
        )
    );

    const tabsNavigation = data.elements.navigation[0];
    const tabListProps = tabsNavigation.domAttributes;
    const tabsContent = data.elements.content[0];

    if (!Number.isNaN(data.element.dataAttributes.activeTab)) {
        tabsProps.defaultIndex = parseInt(data.element.dataAttributes.activeTab, 10);
    }

    return (
        <Tabs
            {...tabsProps}
            className={tabsProps.className + ' ' + tabsClasses.root}
            disabledTabClassName={tabsClasses.tabDisabled}
            selectedTabClassName={tabsClasses.tabSelected}
        >
            <TabList {...tabListProps} className={tabListProps.className + ' ' + tabsClasses.tabList}>
                {tabs}
            </TabList>
            <GenericElement data={tabsContent}>
                {tabsContent.children.map((child, index) => (
                    <TabPanel
                        {...child.domAttributes}
                        key={index}
                        className={child.domAttributes.className + ' ' + tabsClasses.tabPanel}
                        selectedClassName={tabsClasses.tabPanelSelected}
                    >
                        <RichContent data={child.children} />
                    </TabPanel>
                ))}
            </GenericElement>
        </Tabs>
    );
};

export default PageBuilderTabs;
