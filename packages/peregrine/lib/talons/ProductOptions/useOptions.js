import { useCallback } from 'react';

export const useOptions = props => {
    const { onSelectionChange, product, selectedValues } = props;
    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            if (onSelectionChange) {
                onSelectionChange(optionId, selection);
            }
        },
        [onSelectionChange]
    );

    const selectedValueMap = new Map();
    for (const { label, value } of selectedValues) {
        selectedValueMap.set(label, value);
    }

    return {
        options: product.configurable_options || [],
        handleSelectionChange,
        selectedValueMap
    };
};
