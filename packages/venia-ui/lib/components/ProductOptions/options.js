import React from 'react';
import { array, func, object } from 'prop-types';

import Option from './option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const { onSelectionChange, options, selectedValues = [] } = props;

    const talonProps = useOptions({
        onSelectionChange,
        product,
        selectedValues
    });

    const { handleSelectionChange, selectedValueMap } = talonProps;

    // Render a list of options passing in any pre-selected values.
    return options.map(option => (
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
    options: object.isRequired,
    selectedValues: array
};

export default Options;
