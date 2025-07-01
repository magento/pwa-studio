/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

export const LabelledInput = ({
  type,
  checked,
  onChange,
  name,
  label,
  attribute,
  value,
  count,
}) => {
  return (
    <div className="ds-sdk-labelled-input flex items-center">
      <input
        id={name}
        name={
          type === 'checkbox'
            ? `checkbox-group-${attribute}`
            : `radio-group-${attribute}`
        }
        type={type}
        className="ds-sdk-labelled-input__input focus:ring-0 h-md w-md border-0 cursor-pointer accent-gray-600 min-w-[16px]"
        checked={checked}
        aria-checked={checked}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={name}
        className="ds-sdk-labelled-input__label ml-sm block-display text-sm font-light text-gray-700 cursor-pointer"
      >
        {label}
        {count != null && (
          <span className="text-[12px] font-light text-gray-700 ml-1">
            {`(${count})`}
          </span>
        )}
      </label>
    </div>
  );
};
