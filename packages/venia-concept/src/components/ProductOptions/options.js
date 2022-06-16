import React, { useEffect } from 'react';
import { array, func } from 'prop-types';

import Option from '@magento/venia-ui/lib/components/ProductOptions/option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const { classes, onSelectionChange, options, selectedValues = [] } = props;

    const talonProps = useOptions({
        onSelectionChange,
        selectedValues
    });

    const { handleSelectionChange, selectedValueMap } = talonProps;

    //CUSTOM VARIABLES
    const ATTRIBUTE_ID = options[0].attribute_id;
    const VALUE_INDEX = options[0].values[0].value_index;

    //CUSTOM FUNCTION
    useEffect(() => {
        handleSelectionChange(ATTRIBUTE_ID, VALUE_INDEX);
    }, []);

    // Render a list of options passing in any pre-selected values.
    return options.map(option => (
        <Option
            {...option}
            classes={classes}
            key={option.attribute_id}
            onSelectionChange={handleSelectionChange}
            selectedValue={selectedValueMap.get(option.label)}
        />
    ));
};

Options.propTypes = {
    onSelectionChange: func,
    options: array.isRequired,
    selectedValues: array
};

export default Options;
