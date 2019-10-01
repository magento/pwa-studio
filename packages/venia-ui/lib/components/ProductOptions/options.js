import React, { Component } from 'react';
import { array, func, object } from 'prop-types';

import isProductConfigurable from '../../util/isProductConfigurable';

import Option from './option';

class Options extends Component {
    static propTypes = {
        onSelectionChange: func,
        product: object.isRequired,
        selectedValues: array
    };

    handleSelectionChange = (optionId, selection) => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(optionId, selection);
        }
    };

    render() {
        const { handleSelectionChange, props } = this;
        const { product, selectedValues = [] } = props;

        // TODO: Do this check in parent and only pass `configurable_options`
        // instead of the entire `product` as a prop.
        if (!isProductConfigurable(product)) {
            // Non-configurable products don't have options.
            return null;
        }

        const selectedValueMap = new Map();
        for (const { label, value } of selectedValues) {
            selectedValueMap.set(label, value);
        }

        const { configurable_options } = product;
        // Render a list of options passing in any pre-selected values.
        return configurable_options.map(option => (
            <Option
                {...option}
                key={option.attribute_id}
                onSelectionChange={handleSelectionChange}
                selectedValue={selectedValueMap.get(option.label)}
            />
        ));
    }
}

export default Options;
