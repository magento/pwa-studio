import rowConfigAggregator from './ContentTypes/Row/configAggregator';
import Row from './ContentTypes/Row';
import columnConfigAggregator from './ContentTypes/Column/configAggregator';
import Column from './ContentTypes/Column';
import columnGroupConfigAggregator from './ContentTypes/ColumnGroup/configAggregator';
import ColumnGroup from './ContentTypes/ColumnGroup';
import imageConfigAggregator from './ContentTypes/Image/configAggregator';
import Image from './ContentTypes/Image';
import headingConfigAggregator from './ContentTypes/Heading/configAggregator';
import Heading from './ContentTypes/Heading';
import textConfigAggregator from './ContentTypes/Text/configAggregator';
import Text from './ContentTypes/Text';
import tabsConfigAggregator from './ContentTypes/Tabs/configAggregator';
import Tabs from './ContentTypes/Tabs';
import tabItemConfigAggregator from './ContentTypes/TabItem/configAggregator';
import TabItem from './ContentTypes/TabItem';
import blockConfigAggregator from './ContentTypes/Block/configAggregator';
import Block from './ContentTypes/Block';
import productsConfigAggregator from './ContentTypes/Products/configAggregator';
import Products from './ContentTypes/Products';

export const contentTypesConfig = {
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    column: {
        configAggregator: columnConfigAggregator,
        component: Column
    },
    'column-group': {
        configAggregator: columnGroupConfigAggregator,
        component: ColumnGroup
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: Image
    },
    heading: {
        configAggregator: headingConfigAggregator,
        component: Heading
    },
    text: {
        configAggregator: textConfigAggregator,
        component: Text
    },
    tabs: {
        configAggregator: tabsConfigAggregator,
        component: Tabs
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: TabItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: Block
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: Products
    }
};
