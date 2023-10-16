import React from 'react';
import { useIntl } from 'react-intl';
import { bool, shape, string } from 'prop-types';

import Checkbox from '../../Checkbox';
import { useStyle } from '../../../classify';
import defaultClasses from './filterDefault.module.css';
import { useCurrencySwitcher } from '@magento/peregrine/lib/talons/Header/useCurrencySwitcher';

const FilterDefault = props => {
    const {
        classes: propsClasses,
        isSelected,
        item,
        onMouseDown,
        group,
        ...restProps
    } = props;

    const { label, value_index } = item || {};
    const classes = useStyle(defaultClasses, propsClasses);
    const { currentCurrencyCode } = useCurrencySwitcher();
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    const title =
        group === 'price'
            ? currencySymbolMap[currentCurrencyCode] +
              label.replace('-', ' - ' + currencySymbolMap[currentCurrencyCode])
            : label;
    const { formatMessage } = useIntl();

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

    return (
        <Checkbox
            classes={classes}
            field={`${label}-${value_index}`}
            fieldValue={!!isSelected}
            label={title}
            ariaLabel={ariaLabel}
            data-cy="FilterDefault-checkbox"
            onClick={onMouseDown}
            {...restProps}
        />
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
