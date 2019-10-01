import React from 'react';
import { array, func, object } from 'prop-types';

import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import Option from './option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const { onSelectionChange, product, selectedValues = [] } = props;

    const talonProps = useOptions({
        onSelectionChange,
        product,
        selectedValues
    });

    const { handleSelectionChange, selectedValueMap } = talonProps;

    if (!isProductConfigurable(product)) {
        // Non-configurable products don't have options.
        return null;
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
};

Options.propTypes = {
    onSelectionChange: func,
    product: object.isRequired,
    selectedValues: array
};

export default Options;
