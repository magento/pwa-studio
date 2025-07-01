/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useEffect, useState } from 'react';

import '../Slider/Slider.css';

import { useProducts, useSearch } from '../../context';
import useSliderFacet from '../../hooks/useSliderFacet';

export const Slider = ({ filterData }) => {
  const productsCtx = useProducts();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const preSelectedToPrice = productsCtx.variables.filter?.find(
    (obj) => obj.attribute === 'price'
  )?.range?.to;

  const searchCtx = useSearch();

  const [selectedPrice, setSelectedPrice] = useState(
    !preSelectedToPrice
      ? filterData.buckets[filterData.buckets.length - 1].to
      : preSelectedToPrice
  );

  const { onChange } = useSliderFacet(filterData);

  useEffect(() => {
    if (
      searchCtx?.filters?.length === 0 ||
      !searchCtx?.filters?.find((obj) => obj.attribute === 'price')
    ) {
      setSelectedPrice(filterData.buckets[filterData.buckets.length - 1].to);
    }
  }, [searchCtx]);

  useEffect(() => {
    if (!isFirstRender) {
      setSelectedPrice(filterData.buckets[filterData.buckets.length - 1].to);
    }
    setIsFirstRender(false);
  }, [filterData.buckets]);

  const handleSliderChange = (event) => {
    onChange(filterData.buckets[0].from, parseInt(event.target.value, 10));
  };

  const handleNewPrice = (event) => {
    setSelectedPrice(parseInt(event.target.value, 10));
  };

  const formatLabel = (price) => {
    const currencyRate = productsCtx.currencyRate || '1';
    const currencySymbol = productsCtx.currencySymbol || '$';

    const value =
      price && parseFloat(currencyRate) * parseInt(price.toFixed(0), 10)
        ? (parseFloat(currencyRate) * parseInt(price.toFixed(0), 10)).toFixed(2)
        : 0;

    return `${currencySymbol}${value}`;
  };

  return (
    <>
      <p className="pt-md">{filterData.title}</p>
      <div className="ds-sdk-slider slider-container">
        <input
          type="range"
          id="price-range"
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          min={filterData.buckets[0].from}
          max={filterData.buckets[filterData.buckets.length - 1].to}
          value={selectedPrice}
          onChange={handleNewPrice}
          onMouseUp={handleSliderChange}
          onTouchEnd={handleSliderChange}
          onKeyUp={handleSliderChange}
        />
        <span className="selected-price">{formatLabel(selectedPrice)}</span>
        <div className="price-range-display">
          <span className="min-price">
            {formatLabel(filterData.buckets[0].from)}
          </span>
          <span className="max-price">
            {formatLabel(
              filterData.buckets[filterData.buckets.length - 1].to
            )}
          </span>
        </div>
      </div>
      <div className="ds-sdk-input__border border-t mt-md border-gray-200" />
    </>
  );
};

export default Slider;
