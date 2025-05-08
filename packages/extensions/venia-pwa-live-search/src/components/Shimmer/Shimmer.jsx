/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { useSensor } from '../../context'; // Adjust relative path if needed

import ButtonShimmer from '../ButtonShimmer';
import FacetsShimmer from '../FacetsShimmer';
import ProductCardShimmer from '../ProductCardShimmer';

const Shimmer = () => {
  const productCardArray = Array.from({ length: 8 });
  const facetsArray = Array.from({ length: 4 });
  const { screenSize } = useSensor();
  const numberOfColumns = screenSize.columns;

  return (
    <div className="ds-widgets bg-body py-2">
      <div className="flex">
        <div className="sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 flex-col overflow-y-auto">
          <div className="ds-widgets_actions_header flex justify-between items-center mb-md" />
          <div className="flex pb-4 w-full h-full">
            <div className="ds-sdk-filter-button-desktop">
              <button className="flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-md p-sm text-sm h-[32px]">
                <ButtonShimmer />
              </button>
            </div>
          </div>
          <div className="ds-plp-facets flex flex-col">
            <form className="ds-plp-facets__list border-t border-gray-200">
              {facetsArray.map((_, index) => (
                <FacetsShimmer key={index} />
              ))}
            </form>
          </div>
        </div>
        <div className="ds-widgets_results flex flex-col items-center pt-16 w-full h-full">
          <div className="flex flex-col max-w-5xl lg:max-w-7xl ml-auto w-full h-full">
            <div className="flex justify-end mb-[1px]">
              <ButtonShimmer />
            </div>
          </div>
          <div
            className="ds-sdk-product-list__grid mt-md grid-cols-1 gap-y-8 gap-x-md sm:grid-cols-2 md:grid-cols-3 xl:gap-x-4 pl-8"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
            }}
          >
            {productCardArray.map((_, index) => (
              <ProductCardShimmer key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;
