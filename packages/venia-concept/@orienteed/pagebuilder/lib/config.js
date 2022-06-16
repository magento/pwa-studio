import React from 'react';
import rowConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Row/configAggregator';
import Row from '@magento/pagebuilder/lib/ContentTypes/Row';
import columnConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Column/configAggregator';
import Column from '@magento/pagebuilder/lib/ContentTypes/Column';
import columnGroupConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup/configAggregator';
import ColumnGroup from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup';
import imageConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Image/configAggregator';
import { ImageShimmer } from '@magento/pagebuilder/lib/ContentTypes/Image';
import headingConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Heading/configAggregator';
import Heading from '@magento/pagebuilder/lib/ContentTypes/Heading';
import textConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Text/configAggregator';
import Text from '@magento/pagebuilder/lib/ContentTypes/Text';
import tabsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Tabs/configAggregator';
import tabItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/TabItem/configAggregator';
import blockConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Block/configAggregator';
import dynamicBlockConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/DynamicBlock/configAggregator';
import productsConfigAggregator from '@orienteed/pagebuilder/lib/ContentTypes/Products/configAggregator';
import buttonsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Buttons/configAggregator';
import buttonItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ButtonItem/configAggregator';
import htmlConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Html/configAggregator';
import dividerConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Divider/configAggregator';
import videoConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Video/configAggregator';
import mapConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Map/configAggregator';
import bannerConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Banner/configAggregator';
import { BannerShimmer } from '@magento/pagebuilder/lib/ContentTypes/Banner';
import ButtonItem from '@magento/pagebuilder/lib/ContentTypes/ButtonItem';
import sliderConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Slider/configAggregator';
import { SliderShimmer } from '@magento/pagebuilder/lib/ContentTypes/Slider';
import { DynamicBlockShimmer } from '@magento/pagebuilder/lib/ContentTypes/DynamicBlock';
import courseSliderConfigAggregator from '@orienteed/pagebuilder/lib/ContentTypes/CourseSlider/configAggregator';

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
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Image')),
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
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Block'))
    },
    dynamic_block: {
        configAggregator: dynamicBlockConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/DynamicBlock')),
        componentShimmer: DynamicBlockShimmer
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('@orienteed/pagebuilder/lib/ContentTypes/Products'))
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    // Slide is just a banner wrapped inside a slider
    slide: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    // We refer here to the name that is used in the Magento backend
    pagebuilder_lms: {
        configAggregator: courseSliderConfigAggregator,
        component: React.lazy(() => import('@orienteed/pagebuilder/lib/ContentTypes/CourseSlider'))
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
