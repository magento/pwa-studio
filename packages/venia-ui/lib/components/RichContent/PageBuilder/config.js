import * as React from 'react';
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
import tabItemConfigAggregator from './ContentTypes/TabItem/configAggregator';
import blockConfigAggregator from './ContentTypes/Block/configAggregator';
import productsConfigAggregator from './ContentTypes/Products/configAggregator';
import buttonsConfigAggregator from './ContentTypes/Buttons/configAggregator';
import buttonItemConfigAggregator from './ContentTypes/ButtonItem/configAggregator';
import htmlConfigAggregator from './ContentTypes/Html/configAggregator';
import dividerConfigAggregator from './ContentTypes/Divider/configAggregator';


export const Lazy = 'lazy';

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
        load: Lazy,
        configAggregator: tabsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Tabs'))
    },
    'tab-item': {
        load: Lazy,
        configAggregator: tabItemConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/TabItem'))
    },
    buttons: {
        load: Lazy,
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Buttons'))
    },
    'button-item': {
        load: Lazy,
        configAggregator: buttonItemConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/ButtonItem'))
    },
    block: {
        load: Lazy,
        configAggregator: blockConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Block'))
    },
    products: {
        load: Lazy,
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Products'))
    },
    html: {
        load: Lazy,
        configAggregator: htmlConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Html'))
    },
    divider: {
        load: Lazy,
        configAggregator: dividerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Divider'))
    }
};
