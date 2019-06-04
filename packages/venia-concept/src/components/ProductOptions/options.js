import React, { Component } from 'react';
import { func, object } from 'prop-types';

import isProductConfigurable from 'src/util/isProductConfigurable';

import Option from './option';

class Options extends Component {
    static propTypes = {
        onSelectionChange: func,
        product: object
    };

    handleSelectionChange = (optionId, selection) => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(optionId, selection);
        }
    };

    render() {
        const { handleSelectionChange, props } = this;
        const { product } = props;

        if (!isProductConfigurable(product)) {
            // Non-configurable products don't have options.
            return null;
        }

        const { configurable_options } = product;
        return configurable_options.map(option => (
            <Option
                {...option}
                key={option.attribute_id}
                onSelectionChange={handleSelectionChange}
            />
        ));
    }
}

export default Options;
