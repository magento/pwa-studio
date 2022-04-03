import React, { useMemo } from 'react';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';
import RadioGroup from '../../RadioGroup';
import FilterItemRadio from './filterItemRadio';

const FilterItemRadioGroup = props => {
    const {
        filterApi,
        filterState,
        group,
        items,
        name,
        onApply,
        labels
    } = props;
    const radioItems = useMemo(() => {
        return items.map(item => {
            const code = `item-${group}-${item.value}`;
            item.label = name + ': ' + item.title.toString();
            return (
                <FilterItemRadio
                    key={code}
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    item={item}
                    onApply={onApply}
                    labels={labels}
                    field={`item-${group}`}
                />
            );
        });
    }, [filterApi, filterState, group, items, labels, name, onApply]);

    return (
        <RadioGroup field={`item-${group}`} data-cy="FilterDefault-radioGroup">
            {radioItems}
        </RadioGroup>
    );
};

FilterItemRadioGroup.defaultProps = {
    onChange: null
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
    onChange: func
};

export default FilterItemRadioGroup;
