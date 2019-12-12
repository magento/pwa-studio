import { useCallback } from 'react';

export const useOptions = props => {
    const { onSelectionChange, selectedValues } = props;
    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            if (onSelectionChange) {
                onSelectionChange(optionId, selection);
            }
        },
        [onSelectionChange]
    );

    const selectedValueMap = new Map();
    for (const { option_label, value_label } of selectedValues) {
        selectedValueMap.set(option_label, value_label);
    }

    return {
        handleSelectionChange,
        selectedValueMap
    };
};
