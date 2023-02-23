import React from 'react';
import { useIntl } from 'react-intl';
import { bool, shape, string } from 'prop-types';

import Checkbox from '../../Checkbox';
import { useStyle } from '../../../classify';
import defaultClasses from './filterDefault.module.css';
import { useCurrencySwitcher } from '@magento/peregrine/lib/talons/Header/useCurrencySwitcher';
import patches from '@magento/peregrine/lib/util/intlPatches';

const FilterDefault = props => {
    const {
        classes: propsClasses,
        isSelected,
        item,
        group,
        ...restProps
    } = props;

    const { label, value_index } = item || {};
    const classes = useStyle(defaultClasses, propsClasses);
    const { formatMessage, locale } = useIntl();
    const { currentCurrencyCode } = useCurrencySwitcher();
    const parts = patches.toParts.call(
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: currentCurrencyCode
        }),
        0
    );
    const symbol = parts.find(part => part.type === 'currency').value;
    const priceValue = (group === 'price' && label.split('-')) || [];
    const piceLabel =
        (!!priceValue.length &&
            `${symbol + priceValue[0]} - ${symbol + priceValue[1]}`) ||
        false;
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
            label={piceLabel || label}
            ariaLabel={ariaLabel}
            data-cy="FilterDefault-checkbox"
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
