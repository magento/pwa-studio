import { useCallback } from 'react';

export const useOptions = props => {
    const { onSelectionChange, selectedValues, options } = props;
    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            if (onSelectionChange) {
                onSelectionChange(optionId, selection);
            }
        },
        [onSelectionChange]
    );

    const selectedValueMap = new Map();

    // Map the option with correct option_label
    for (const { id, value_label } of selectedValues) {
        const option_label = options.find(
            option => option.attribute_id === String(id)
        ).label;
        selectedValueMap.set(option_label, value_label);
    }
    return {
        handleSelectionChange,
        selectedValueMap
    };
};
