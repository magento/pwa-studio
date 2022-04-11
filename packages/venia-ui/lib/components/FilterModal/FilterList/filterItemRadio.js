import React, { useCallback } from 'react';
import { func, number, oneOfType, shape, string, instanceOf } from 'prop-types';
import Radio from '../../RadioGroup/radio';
import defaultClasses from './filterItemRadio.module.css';
import { useStyle } from '../../../classify';
import { useIntl } from 'react-intl';

const FilterItemRadio = props => {
    const { filterApi, group, item, onApply, labels } = props;
    const { removeGroup, toggleItem } = filterApi;
    const { title, value } = item;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const label = item.label ? item.label : item.title;

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.item.applyFilter',
            defaultMessage: 'Apply filter "{optionName}".'
        },
        {
            optionName: label
        }
    );

    const handleOnchange = useCallback(
        e => {
            removeGroup({ group });
            if (e.target.value === item.value) {
                toggleItem({ group, item });
            }
            if (typeof onApply === 'function') {
                onApply(group, item);
            }
        },
        [group, item, onApply, removeGroup, toggleItem]
    );

    const element = (
        <Radio
            classes={classes}
            id={`item-${group}-${value}`}
            label={title}
            value={value}
            onChange={handleOnchange}
            data-cy="FilterDefault-radio"
            ariaLabel={ariaLabel}
        />
    );

    labels.set(element, label);

    return element;
};

FilterItemRadio.defaultProps = {
    onApply: null
};

FilterItemRadio.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired,
        removeGroup: func.isRequired
    }).isRequired,
    group: string.isRequired,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired,
        label: string
    }).isRequired,
    onApply: func,
    labels: instanceOf(Map).isRequired
};

export default FilterItemRadio;
