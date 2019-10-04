import { useCallback } from 'react';

export const useOptions = props => {
    const { onSelectionClick, selectedValues } = props;
    const handleSelectionClick = useCallback(
        (optionId, selection) => {
            if (onSelectionClick) {
                onSelectionClick(optionId, selection);
            }
        },
        [onSelectionClick]
    );

    const selectedValueMap = new Map();
    for (const { label, value } of selectedValues) {
        selectedValueMap.set(label, value);
    }

    return {
        handleSelectionClick,
        selectedValueMap
    };
};
