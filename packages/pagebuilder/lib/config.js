import React from 'react';
import rowConfigAggregator from './ContentTypes/Row/configAggregator';
import Row from './ContentTypes/Row';
import columnConfigAggregator from './ContentTypes/Column/configAggregator';
import Column from './ContentTypes/Column';
import columnGroupConfigAggregator from './ContentTypes/ColumnGroup/configAggregator';
import ColumnGroup from './ContentTypes/ColumnGroup';
import imageConfigAggregator from './ContentTypes/Image/configAggregator';
import { ImageShimmer } from './ContentTypes/Image';
import headingConfigAggregator from './ContentTypes/Heading/configAggregator';
import Heading from './ContentTypes/Heading';
import textConfigAggregator from './ContentTypes/Text/configAggregator';
import Text from './ContentTypes/Text';
import tabsConfigAggregator from './ContentTypes/Tabs/configAggregator';
import tabItemConfigAggregator from './ContentTypes/TabItem/configAggregator';
import blockConfigAggregator from './ContentTypes/Block/configAggregator';
import dynamicBlockConfigAggregator from './ContentTypes/DynamicBlock/configAggregator';
import productsConfigAggregator from './ContentTypes/Products/configAggregator';
import buttonsConfigAggregator from './ContentTypes/Buttons/configAggregator';
import buttonItemConfigAggregator from './ContentTypes/ButtonItem/configAggregator';
import htmlConfigAggregator from './ContentTypes/Html/configAggregator';
import dividerConfigAggregator from './ContentTypes/Divider/configAggregator';
import videoConfigAggregator from './ContentTypes/Video/configAggregator';
import mapConfigAggregator from './ContentTypes/Map/configAggregator';
import bannerConfigAggregator from './ContentTypes/Banner/configAggregator';
import { BannerShimmer } from './ContentTypes/Banner';
import ButtonItem from './ContentTypes/ButtonItem';
import sliderConfigAggregator from './ContentTypes/Slider/configAggregator';
import { SliderShimmer } from './ContentTypes/Slider';
import { DynamicBlockShimmer } from './ContentTypes/DynamicBlock';

/* istanbul ignore next */
const contentTypesConfig = {
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
        component: React.lazy(() => import('./ContentTypes/Image')),
        componentShimmer: ImageShimmer
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
        component: React.lazy(() => import('./ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Block'))
    },
    dynamic_block: {
        configAggregator: dynamicBlockConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/DynamicBlock')),
        componentShimmer: DynamicBlockShimmer
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Products'))
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    // Slide is just a banner wrapped inside a slider
    slide: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    }
};

/**
 * Retrieve a content types configuration
 *
 * @param {string} contentType
 * @returns {*}
 */
export function getContentTypeConfig(contentType) {
    if (contentTypesConfig[contentType]) {
        return contentTypesConfig[contentType];
    }
}

/**
 * Set content types configuration with new one
 *
 * @param {string} contentType
 * @param {*} config
 * @returns {*}
 */
export function setContentTypeConfig(contentType, config) {
    return (contentTypesConfig[contentType] = config);
}
