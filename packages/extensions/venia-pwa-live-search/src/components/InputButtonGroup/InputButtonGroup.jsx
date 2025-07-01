/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useState } from 'react';

import { useProducts, useTranslation } from '../../context';
import PlusIcon from '../../icons/plus.svg';
import { BOOLEAN_NO, BOOLEAN_YES } from '../../utils/constants';
import { LabelledInput } from '../LabelledInput';

const numberOfOptionsShown = 5;

const InputButtonGroup = ({
  title,
  attribute,
  buckets,
  isSelected,
  onChange,
  type,
  inputGroupTitleSlot
}) => {
  const translation = useTranslation();
  const productsCtx = useProducts();

  const [showMore, setShowMore] = useState(buckets.length < numberOfOptionsShown);

  const numberOfOptions = showMore ? buckets.length : numberOfOptionsShown;

  const onInputChange = (title, e) => {
    onChange({
      value: title,
      selected: e?.target?.checked
    });
  };

  const formatLabel = (title, bucket) => {
    if (bucket.__typename === 'RangeBucket') {
      const currencyRate = productsCtx.currencyRate || '1';
      const currencySymbol = productsCtx.currencySymbol || '$';
      const from = bucket?.from
        ? (parseFloat(currencyRate) * parseInt(bucket.from.toFixed(0), 10)).toFixed(2)
        : 0;
      const to = bucket?.to
        ? ` - ${currencySymbol}${(
            parseFloat(currencyRate) * parseInt(bucket.to.toFixed(0), 10)
          ).toFixed(2)}`
        : translation.InputButtonGroup.priceRange;
      return `${currencySymbol}${from}${to}`;
    } else if (bucket.__typename === 'CategoryView') {
      return productsCtx.categoryPath ? (bucket.name !== undefined && bucket.name !== null ? bucket.name : bucket.title) : bucket.title;
    } else if (bucket.title === BOOLEAN_YES) {
      return title;
    } else if (bucket.title === BOOLEAN_NO) {
      const excludedMessageTranslation = translation.InputButtonGroup.priceExcludedMessage;
      const excludedMessage = excludedMessageTranslation.replace('{title}', `${title}`);
      return excludedMessage;
    }
    return bucket.title;
  };

  return (
    <div className="ds-sdk-input pt-md">
      {inputGroupTitleSlot ? (
        inputGroupTitleSlot(title)
      ) : (
        <label className="ds-sdk-input__label text-base font-normal text-gray-900">
          {title}
        </label>
      )}
      <fieldset className="ds-sdk-input__options mt-md">
        <div className="space-y-4">
          {buckets.slice(0, numberOfOptions).map((option) => {
            if (!option.title) {
              return null;
            }
            const checked = isSelected(option.title);
            const noShowPriceBucketCount = option.__typename === 'RangeBucket';
            return (
              <LabelledInput
                key={formatLabel(title, option)}
                name={`${option.title}-${attribute}`}
                attribute={attribute}
                label={formatLabel(title, option)}
                checked={!!checked}
                value={option.title}
                count={noShowPriceBucketCount ? null : option.count}
                onChange={(e) => onInputChange(option.title, e)}
                type={type}
              />
            );
          })}
          {!showMore && buckets.length > numberOfOptionsShown && (
            <div
              className="ds-sdk-input__fieldset__show-more flex items-center text-gray-700 cursor-pointer"
              onClick={() => setShowMore(true)}
            >
              <img src={PlusIcon} height="16px" width="16px" className="h-md w-md fill-gray-500" />
              {/* <PlusIcon className="h-md w-md fill-gray-500" /> */}
              <button
                type="button"
                className="ml-sm font-light cursor-pointer border-none bg-transparent hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none text-sm"
              >
                {translation.InputButtonGroup.showmore}
              </button>
            </div>
          )}
        </div>
      </fieldset>
      <div className="ds-sdk-input__border border-t mt-md border-gray-200" />
    </div>
  );
};

export default InputButtonGroup;
