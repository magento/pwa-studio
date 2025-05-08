import React, { useEffect, useState } from 'react';
import './SliderDoubleControl.css';

import { useProducts, useSearch } from '../../context';
import useSliderFacet from '../../hooks/useSliderFacet';

export const SliderDoubleControl = ({ filterData }) => {
  const productsCtx = useProducts();
  const searchCtx = useSearch();
  const min = filterData.buckets[0].from;
  const max = filterData.buckets[filterData.buckets.length - 1].to;

  const preSelectedToPrice = productsCtx.variables.filter?.find(
    obj => obj.attribute === 'price'
  )?.range?.to;
  const preSelectedFromPrice = productsCtx.variables.filter?.find(
    obj => obj.attribute === 'price'
  )?.range?.from;
  //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
  // const [minVal, setMinVal] = useState(preSelectedFromPrice ?? min);
  // const [maxVal, setMaxVal] = useState(preSelectedToPrice ?? max);
  // workaround
  const [minVal, setMinVal] = useState(
    preSelectedFromPrice !== null && preSelectedFromPrice !== undefined ? preSelectedFromPrice : min
  );
  const [maxVal, setMaxVal] = useState(
    preSelectedToPrice !== null && preSelectedToPrice !== undefined ? preSelectedToPrice : max
  );
  
  const { onChange } = useSliderFacet(filterData);

  const fromSliderId = `fromSlider_${filterData.attribute}`;
  const toSliderId = `toSlider_${filterData.attribute}`;
  const fromInputId = `fromInput_${filterData.attribute}`;
  const toInputId = `toInput_${filterData.attribute}`;

  useEffect(() => {
    if (
      searchCtx?.filters?.length === 0 ||
      !searchCtx?.filters?.find(obj => obj.attribute === filterData.attribute)
    ) {
      setMinVal(min);
      setMaxVal(max);
    }
  }, [searchCtx]);

  useEffect(() => {
    const getParsed = (fromEl, toEl) => [
      parseInt(fromEl.value, 10),
      parseInt(toEl.value, 10)
    ];

    const fillSlider = (from, to, sliderColor, rangeColor, controlSlider) => {
      const rangeDistance = to.max - to.min;
      const fromPosition = from.value - to.min;
      const toPosition = to.value - to.min;
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(toPosition / rangeDistance) * 100}%,
        ${sliderColor} ${(toPosition / rangeDistance) * 100}%,
        ${sliderColor} 100%)`;
    };

    const controlFromSlider = (fromSlider, toSlider, fromInput) => {
      const [from, to] = getParsed(fromSlider, toSlider);
      fillSlider(fromSlider, toSlider, '#C6C6C6', '#383838', toSlider);
      if (from > to) {
        setMinVal(to);
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromInput.value = from;
      }
    };

    const controlToSlider = (fromSlider, toSlider, toInput) => {
      const [from, to] = getParsed(fromSlider, toSlider);
      fillSlider(fromSlider, toSlider, '#C6C6C6', '#383838', toSlider);
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        setMaxVal(from);
        toInput.value = from;
        toSlider.value = from;
      }
    };

    const controlFromInput = (fromSlider, fromInput, toInput, controlSlider) => {
      const [from, to] = getParsed(fromInput, toInput);
      fillSlider(fromInput, toInput, '#C6C6C6', '#383838', controlSlider);
      if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromSlider.value = from;
      }
    };

    const controlToInput = (toSlider, fromInput, toInput, controlSlider) => {
      const [from, to] = getParsed(fromInput, toInput);
      fillSlider(fromInput, toInput, '#C6C6C6', '#383838', controlSlider);
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        toInput.value = from;
      }
    };

    const fromSlider = document.getElementById(fromSliderId);
    const toSlider = document.getElementById(toSliderId);
    const fromInput = document.getElementById(fromInputId);
    const toInput = document.getElementById(toInputId);

    if (!fromSlider || !toSlider || !fromInput || !toInput) return;

    fillSlider(fromSlider, toSlider, '#C6C6C6', '#383838', toSlider);

    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
    fromInput.oninput = () =>
      controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () =>
      controlToInput(toSlider, fromInput, toInput, toSlider);
  }, [minVal, maxVal]);

  const formatLabel = (price) => {
    const currencyRate = productsCtx.currencyRate || 1;
    const currencySymbol = productsCtx.currencySymbol || '$';
    const label = `${currencySymbol}${
      price ? (parseFloat(currencyRate) * parseInt(price.toFixed(0), 10)).toFixed(2) : 0
    }`;
    return label;
  };

  return (
    <div className="ds-sdk-input pt-md">
      <label className="ds-sdk-input__label text-base font-normal text-gray-900">
        {filterData.title}
      </label>

      <div className="ds-sdk-slider range_container">
        <div className="sliders_control">
          <input
            className="ds-sdk-slider__from fromSlider"
            id={fromSliderId}
            type="range"
            value={minVal}
            min={min}
            max={max}
            onInput={({ target }) => setMinVal(Math.round(Number(target.value)))}
            onMouseUp={() => onChange(minVal, maxVal)}
            onTouchEnd={() => onChange(minVal, maxVal)}
            onKeyUp={() => onChange(minVal, maxVal)}
          />
          <input
            className="ds-sdk-slider__to toSlider"
            id={toSliderId}
            type="range"
            value={maxVal}
            min={min}
            max={max}
            onInput={({ target }) => setMaxVal(Math.round(Number(target.value)))}
            onMouseUp={() => onChange(minVal, maxVal)}
            onTouchEnd={() => onChange(minVal, maxVal)}
            onKeyUp={() => onChange(minVal, maxVal)}
          />
        </div>

        <div className="form_control">
          <div className="form_control_container">
            <div className="form_control_container__time">Min</div>
            <input
              className="form_control_container__time__input"
              type="number"
              id={fromInputId}
              value={minVal}
              min={min}
              max={max}
              onInput={({ target }) => setMinVal(Math.round(Number(target.value)))}
              onMouseUp={() => onChange(minVal, maxVal)}
              onTouchEnd={() => onChange(minVal, maxVal)}
              onKeyUp={() => onChange(minVal, maxVal)}
            />
          </div>
          <div className="form_control_container">
            <div className="form_control_container__time">Max</div>
            <input
              className="form_control_container__time__input"
              type="number"
              id={toInputId}
              value={maxVal}
              min={min}
              max={max}
              onInput={({ target }) => setMaxVal(Math.round(Number(target.value)))}
              onMouseUp={() => onChange(minVal, maxVal)}
              onTouchEnd={() => onChange(minVal, maxVal)}
              onKeyUp={() => onChange(minVal, maxVal)}
            />
          </div>
        </div>
      </div>

      <div className={`price-range-display__${filterData.attribute} pb-3`}>
        <span className="ml-sm block-display text-sm font-light text-gray-700">
          Between{' '}
          <span className="min-price text-gray-900 font-semibold">
            {formatLabel(minVal)}
          </span>{' '}
          and{' '}
          <span className="max-price text-gray-900 font-semibold">
            {formatLabel(maxVal)}
          </span>
        </span>
      </div>
      <div className="ds-sdk-input__border border-t mt-md border-gray-200" />
    </div>
  );
};
