import React from 'react';
import { TabPanel } from 'react-tabs';
import getContentNodeStyle from './getContentNodeStyle';

const TabItem = props => {
    return (
        <TabPanel style={getContentNodeStyle(props)}>{props.children}</TabPanel>
    );
};

export default TabItem;
