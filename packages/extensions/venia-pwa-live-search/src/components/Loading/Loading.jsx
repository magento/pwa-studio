/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import LoadingIcon from '../../icons/loading.svg';

export const Loading = ({ label }) => {
  const isMobile = typeof window !== 'undefined' &&
    window.matchMedia('only screen and (max-width: 768px)').matches;

  return (
    <div
      className={`ds-sdk-loading flex h-screen justify-center items-center ${
        isMobile ? 'loading-spinner-on-mobile' : ''
      }`}
    >
      <div className="ds-sdk-loading__spinner bg-gray-100 rounded-full p-xs flex w-fit my-lg outline-gray-200">
        <LoadingIcon className="inline-block mr-xs ml-xs w-md animate-spin fill-primary" />
        <span className="ds-sdk-loading__spinner-label p-xs">{label}</span>
      </div>
    </div>
  );
};

export default Loading;
