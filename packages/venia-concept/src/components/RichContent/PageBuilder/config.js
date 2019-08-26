import rowConfigAggregator from "./ContentTypes/Row/configAggregator";
import Row from './ContentTypes/Row/row';
import columnConfigAggregator from "./ContentTypes/Column/configAggregator";
import Column from './ContentTypes/Column/column';
import columnGroupConfigAggregator from "./ContentTypes/ColumnGroup/configAggregator";
import ColumnGroup from './ContentTypes/ColumnGroup/columnGroup';
import imageConfigAggregator from "./ContentTypes/Image/configAggregator";
import Image from './ContentTypes/Image/image';
import headingConfigAggregator from "./ContentTypes/Heading/configAggregator";
import Heading from './ContentTypes/Heading/heading';
import textConfigAggregator from "./ContentTypes/Text/configAggregator";
import Text from './ContentTypes/Text/text';
import blockConfigAggregator from "./ContentTypes/Block/configAggregator";
import Block from './ContentTypes/Block/block';

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
    block: {
        configAggregator: blockConfigAggregator,
        component: Block
    },
};
