/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';

import { useStore } from '../../context';
import RangeFacet from './Range/RangeFacet';
import ScalarFacet from './Scalar/ScalarFacet';
import SliderDoubleControl from '../SliderDoubleControl';

export const Facets = ({ searchFacets }) => {
  const {
    config: { priceSlider },
  } = useStore();

  return (
    <div className="ds-plp-facets flex flex-col">
      <form className="ds-plp-facets__list border-t border-gray-200">
        {searchFacets?.map((facet) => {
          const bucketType = facet?.buckets[0]?.__typename;
          switch (bucketType) {
            case 'ScalarBucket':
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
            case 'RangeBucket':
              return priceSlider ? (
                <SliderDoubleControl filterData={facet} />
              ) : (
                <RangeFacet
                  key={facet.attribute}
                  filterData={facet}
                />
              );
            case 'CategoryView':
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
            default:
              return null;
          }
        })}
      </form>
    </div>
  );
};

export default Facets;
