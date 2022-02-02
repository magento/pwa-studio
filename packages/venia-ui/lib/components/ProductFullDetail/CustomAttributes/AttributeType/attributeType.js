import React from 'react';

import { useAttributeType } from '@magento/peregrine/lib/talons/ProductFullDetail/CustomAttributes/AttributeType/useAttributeType';

import Boolean from './Boolean';
import Date from './Date';
import DateTime from './DateTime';
import Multiselect from './Multiselect';
import Price from './Price';
import Select from './Select';
import Text from './Text';
import Textarea from './Textarea';

const defaultTypeConfig = {
    boolean: {
        component: Boolean
    },
    date: {
        component: Date
    },
    datetime: {
        component: DateTime
    },
    multiselect: {
        component: Multiselect
    },
    price: {
        component: Price
    },
    select: {
        component: Select
    },
    text: {
        component: Text
    },
    textarea: {
        component: Textarea
    }
};

const AttributeType = props => {
    const { data, ...rest } = props;
    const { ui_input_type: type } = data?.attribute_metadata.ui_input || {};

    const { getAttributeTypeConfig } = useAttributeType({
        typeConfig: defaultTypeConfig
    });

    if (type) {
        const attributeTypeConfig = getAttributeTypeConfig(type.toLowerCase());
        if (attributeTypeConfig && attributeTypeConfig.component) {
            const Component = attributeTypeConfig.component;

            return <Component {...data} {...rest} />;
        }
    }

    return null;
};

export default AttributeType;
