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
        const { product, selectedValues } = props;

        if (!isProductConfigurable(product)) {
            // Non-configurable products don't have options.
            return null;
        }

        const { configurable_options } = product;

        // Render a list of options passing in any pre-selected values.
        // TODO: wrap in useMemo
        return configurable_options.map(option => {
            const selectedValue =
                (selectedValues &&
                    selectedValues.find(
                        selectedOption => selectedOption.label === option.label
                    ).value) ||
                undefined;
            return (
                <Option
                    {...option}
                    key={option.attribute_id}
                    onSelectionChange={handleSelectionChange}
                    selectedValue={selectedValue}
                />
            );
        });
    }
}

export default Options;
