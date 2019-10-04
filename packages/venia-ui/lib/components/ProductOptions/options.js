import React from 'react';
import { array, func } from 'prop-types';

import Option from './option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const { onSelectionClick, options, selectedValues = [] } = props;

    const talonProps = useOptions({
        onSelectionClick,
        selectedValues
    });

    const { handleSelectionClick, selectedValueMap } = talonProps;

    // Render a list of options passing in any pre-selected values.
    return options.map(option => (
        <Option
            {...option}
            key={option.attribute_id}
            onSelectionClick={handleSelectionClick}
            selectedValue={selectedValueMap.get(option.label)}
        />
    ));
};

Options.propTypes = {
    onSelectionClick: func,
    options: array.isRequired,
    selectedValues: array
};

export default Options;
