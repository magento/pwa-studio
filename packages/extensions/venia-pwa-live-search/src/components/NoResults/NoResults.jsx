/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

export const NoResults = ({ heading, subheading, isError }) => {
  return (
    <div className="ds-sdk-no-results__page">
      {isError ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-28 w-28 my-0 mx-auto stroke-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-28 w-28 my-0 mx-auto stroke-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      )}
      <h1 className="ds-sdk-no-results__page__heading text-2xl text-center text-gray-600">
        {heading}
      </h1>
      <h3 className="ds-sdk-no-results__page__subheading text-lg text-center text-gray-500">
        {subheading}
      </h3>
    </div>
  );
};

export default NoResults;
