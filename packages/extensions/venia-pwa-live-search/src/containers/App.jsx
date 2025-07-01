/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useState } from 'react';
import { FilterButton } from '../components/FilterButton';
import Loading from '../components/Loading';
import Shimmer from '../components/Shimmer';

import { CategoryFilters } from '../components/CategoryFilters';
import { SelectedFilters } from '../components/Facets';
import {
  useProducts,
  useSearch,
  useSensor,
  useStore,
  useTranslation
} from '../context';
import ProductsContainer from './ProductsContainer';
import { ProductsHeader } from './ProductsHeader';

const App = () => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const translation = useTranslation();
  const { displayMode } = useStore().config;
  const [showFilters, setShowFilters] = useState(true);

  const loadingLabel = translation.Loading.title;

  let title = productsCtx.categoryName || '';
  if (productsCtx.variables.phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${productsCtx.variables.phrase !== null && productsCtx.variables.phrase !== undefined ? productsCtx.variables.phrase : ''}"`);

  }

  const getResults = (totalCount) => {
    const resultsTranslation = translation.CategoryFilters.products;
    return resultsTranslation.replace('{totalCount}', `${totalCount}`);
  };

  return (
    <>
      {!(displayMode === 'PAGE') &&
        (!screenSize.mobile && showFilters && productsCtx.facets.length > 0 ? (
          <div className="ds-widgets bg-body py-2 px-2">
            <div className="flex">
              <CategoryFilters
                loading={productsCtx.loading}
                pageLoading={productsCtx.pageLoading}
                facets={productsCtx.facets}
                totalCount={productsCtx.totalCount}
                categoryName={productsCtx.categoryName !== null && productsCtx.categoryName !== undefined ? productsCtx.categoryName : ''}
                phrase={productsCtx.variables.phrase !== null && productsCtx.variables.phrase !== undefined ? productsCtx.variables.phrase : ''}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filterCount={searchCtx.filterCount}
              />
              <div
                className={`ds-widgets_results flex flex-col items-center ${
                  productsCtx.categoryName ? 'pt-16' : 'pt-28'
                } w-full h-full`}
              >
                <ProductsHeader
                  facets={productsCtx.facets}
                  totalCount={productsCtx.totalCount}
                  screenSize={screenSize}
                />
                <SelectedFilters />
                <ProductsContainer showFilters={showFilters} />
              </div>
            </div>
          </div>
        ) : (
          <div className="ds-widgets bg-body py-2 px-2">
            <div className="flex flex-col">
              <div className="flex flex-col items-center w-full h-full">
                <div className="justify-start w-full h-full">
                  <div className="hidden sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 flex-col overflow-y-auto">
                    <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
                      {title && <span>{title}</span>}
                      {!productsCtx.loading && (
                        <span className="text-primary text-sm">
                          {getResults(productsCtx.totalCount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ds-widgets_results flex flex-col items-center w-full h-full">
                <div className="flex w-full h-full">
                  {!screenSize.mobile &&
                    !productsCtx.loading &&
                    productsCtx.facets.length > 0 && (
                      <div className="flex w-full h-full">
                        <FilterButton
                          displayFilter={() => setShowFilters(true)}
                          type="desktop"
                          title={`${translation.Filter.showTitle}${
                            searchCtx.filterCount > 0
                              ? ` (${searchCtx.filterCount})`
                              : ''
                          }`}
                        />
                      </div>
                    )}
                </div>
                {productsCtx.loading ? (
                  screenSize.mobile ? (
                    <Loading label={loadingLabel} />
                  ) : (
                    <Shimmer />
                  )
                ) : (
                  <>
                    <div className="flex w-full h-full">
                      <ProductsHeader
                        facets={productsCtx.facets}
                        totalCount={productsCtx.totalCount}
                        screenSize={screenSize}
                      />
                    </div>
                    <SelectedFilters />
                    <ProductsContainer
                      showFilters={showFilters && productsCtx.facets.length > 0}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default App;
