/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

export const SearchBar = ({
  phrase,
  onKeyPress,
  placeholder,
  onClear, // included for completeness, though unused in this component
  ...rest
}) => {
  return (
    <div className="relative ds-sdk-search-bar">
      <input
        id="search"
        type="text"
        value={phrase}
        onKeyPress={onKeyPress}
        className="border border-gray-300 text-gray-800 text-sm block-display p-xs pr-lg ds-sdk-search-bar__input"
        placeholder={placeholder}
        autoComplete="off"
        {...rest}
      />
    </div>
  );
};
