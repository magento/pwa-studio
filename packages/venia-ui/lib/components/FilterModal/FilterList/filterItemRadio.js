import React, { useCallback } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';
import Radio from '../../RadioGroup/radio';
import defaultClasses from './filteritemRadio.module.css';
import { useStyle } from '../../../classify';
import { useIntl } from 'react-intl';

const FilterItemRadio = props => {
    const { filterApi, filterState, group, item, onApply, labels } = props;
    const { removeGroup, toggleItem } = filterApi;
    const { title, value } = item;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const label = item.label ? item.label : item.title;
    const isSelected = filterState && filterState.has(item);

    const ariaLabel = !isSelected
        ? formatMessage(
              {
                  id: 'filterModal.item.applyFilter',
                  defaultMessage: 'Apply filter "{optionName}".'
              },
              {
                  optionName: label
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.clearFilter',
                  defaultMessage: 'Remove filter "{optionName}".'
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
            field={`item-${group}`}
            onChange={handleOnchange}
            fieldValue={!!isSelected}
            data-cy="FilterDefault-radio"
            ariaLabel={ariaLabel}
        />
    );

    labels.set(element, label);

    return element;
};

FilterItemRadio.defaultProps = {
    onChange: null
};

FilterItemRadio.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired,
        removeGroup: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired,
        label: string
    }).isRequired,
    onChange: func
};

export default FilterItemRadio;
