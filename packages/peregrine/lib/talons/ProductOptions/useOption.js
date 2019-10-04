import { useCallback, useMemo, useState } from 'react';

/**
 * Talon for Option.
 *
 * @param {number} props.attribute_id the id of the option
 * @param {string} props.label the label for the option
 * @param {function} props.onSelectionClick callback handler for when the option is clicked
 * @param {string} props.selectedValue the label of the selected option
 * @param {array} props.values an array containing possible values
 */
export const useOption = props => {
    const {
        attribute_id,
        label,
        onSelectionClick,
        selectedValue,
        values
    } = props;
    const [selection, setSelection] = useState(null);
    const initialSelection = useMemo(() => {
        let initialSelection = {};
        const searchValue = selection || selectedValue;
        if (searchValue) {
            initialSelection =
                values.find(value => value.default_label === searchValue) || {};
        }
        return initialSelection;
    }, [selectedValue, selection, values]);

    const valuesMap = useMemo(() => {
        return new Map(
            values.map(value => [value.value_index, value.store_label])
        );
    }, [values]);

    const selectedValueLabel = `Selected ${label}:`;
    const selectedValueDescription =
        selection || initialSelection.default_label || 'None';

    const handleSelectionClick = useCallback(
        selection => {
            setSelection(valuesMap.get(selection));

            if (onSelectionClick) {
                onSelectionClick(attribute_id, selection);
            }
        },
        [attribute_id, onSelectionClick, valuesMap]
    );
    return {
        handleSelectionClick,
        initialSelection,
        selectedValueLabel,
        selectedValueDescription
    };
};
