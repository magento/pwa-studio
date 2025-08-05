/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import CloseIcon from '../../icons/plus.svg';

const defaultIcon = (
  <img src={CloseIcon} className="h-[12px] w-[12px] rotate-45 inline-block ml-sm cursor-pointer fill-gray-700" />
  // <CloseIcon className="h-[12px] w-[12px] rotate-45 inline-block ml-sm cursor-pointer fill-gray-700" />
);

export const Pill = ({ label, onClick, CTA = defaultIcon, type }) => {
  const containerClasses =
    type === 'transparent'
      ? 'ds-sdk-pill inline-flex justify-content items-center rounded-full w-fit min-h-[32px] px-4 py-1'
      : 'ds-sdk-pill inline-flex justify-content items-center bg-gray-100 rounded-full w-fit outline outline-gray-200 min-h-[32px] px-4 py-1';

  return (
    <div key={label} className={containerClasses}>
      <span className="ds-sdk-pill__label font-normal text-sm">{label}</span>
      <span className="ds-sdk-pill__cta" onClick={onClick}>
        {CTA}
      </span>
    </div>
  );
};

export default Pill;
