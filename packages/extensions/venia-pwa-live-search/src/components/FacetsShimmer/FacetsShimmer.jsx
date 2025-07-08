import React from 'react';
import './FacetsShimmer.css';

export const FacetsShimmer = () => {
  return (
    <>
      <div className="ds-sdk-input ds-sdk-input--loading">
        <div className="ds-sdk-input__content">
          <div className="ds-sdk-input__header">
            <div className="ds-sdk-input__title shimmer-animation-facet" />
          </div>
          <div className="ds-sdk-input__list">
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
            <div className="ds-sdk-input__item shimmer-animation-facet" />
          </div>
        </div>
      </div>
      <div className="ds-sdk-input__border border-t mt-md border-gray-200" />
    </>
  );
};

//export default FacetsShimmer;
