import React, { useMemo, useEffect } from 'react';
import {
    arrayOf,
    func,
    number,
    oneOfType,
    shape,
    string,
    instanceOf
} from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';
import RadioGroup from '../../RadioGroup';
import FilterItemRadio from './filterItemRadio';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

const FilterItemRadioGroup = props => {
    const { filterApi, filterState, group, items, onApply, labels } = props;

    const radioItems = useMemo(() => {
        return items.map(item => {
            const code = `item-${group}-${item.value}`;
            return (
                <FilterItemRadio
                    key={code}
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    item={item}
                    onApply={onApply}
                    labels={labels}
                />
            );
        });
    }, [filterApi, filterState, group, items, labels, onApply]);

    const fieldValue = useMemo(() => {
        if (filterState) {
            for (const item of items) {
                if (filterState.has(item)) {
                    return item.value;
                }
            }
        }

        return null;
    }, [filterState, items]);
    const field = `item-${group}`;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    useEffect(() => {
        if (field && fieldValue === null) {
            fieldApi.reset();
        } else if (field && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [field, fieldApi, fieldState.value, fieldValue]);

    return (
        <RadioGroup field={field} data-cy="FilterDefault-radioGroup">
            {radioItems}
        </RadioGroup>
    );
};

FilterItemRadioGroup.defaultProps = {
    onApply: null
};

FilterItemRadioGroup.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(
        shape({
            title: string.isRequired,
            value: oneOfType([number, string]).isRequired
        })
    ).isRequired,
    onApply: func,
    labels: instanceOf(Map).isRequired
};

export default FilterItemRadioGroup;
