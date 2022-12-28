import loadable from '@loadable/component';
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
        component: loadable(() => import('./ContentTypes/Image')),
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
        component: loadable(() => import('./ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: loadable(() => import('./ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: loadable(() => import('./ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: loadable(() => import('./ContentTypes/Block'))
    },
    dynamic_block: {
        configAggregator: dynamicBlockConfigAggregator,
        component: loadable(() => import('./ContentTypes/DynamicBlock')),
        componentShimmer: DynamicBlockShimmer
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: loadable(() => import('./ContentTypes/Products'))
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: loadable(() => import('./ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: loadable(() => import('./ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: loadable(() => import('./ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: loadable(() => import('./ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: loadable(() => import('./ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: loadable(() => import('./ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    // Slide is just a banner wrapped inside a slider
    slide: {
        configAggregator: bannerConfigAggregator,
        component: loadable(() => import('./ContentTypes/Banner')),
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
