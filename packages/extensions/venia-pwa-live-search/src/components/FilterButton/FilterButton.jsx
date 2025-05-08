/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { useTranslation } from '../../context/translation';
import AdjustmentsIcon from '../../icons/adjustments.svg';

export const FilterButton = ({ displayFilter, type, title }) => {
  const translation = useTranslation();

  return type === 'mobile' ? (
    <div className="ds-sdk-filter-button">
      <button
        className="flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-md p-sm outline outline-gray-200 hover:outline-gray-800 h-[32px]"
        onClick={displayFilter}
      >
        <AdjustmentsIcon className="w-md" />
        {translation.Filter.title}
      </button>
    </div>
  ) : (
    <div className="ds-sdk-filter-button-desktop">
      <button
        className="flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-md p-sm text-sm h-[32px]"
        onClick={displayFilter}
      >
        {title}
      </button>
    </div>
  );
};

export default FilterButton;
