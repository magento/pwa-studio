/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useCallback, useEffect, useState } from 'react';

import ViewSwitcher from '../components/ViewSwitcher';
import Facets from '../components/Facets';
import { FilterButton } from '../components/FilterButton';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';

import {
  useAttributeMetadata,
  useProducts,
  useSearch,
  useStore,
  useTranslation,
} from '../context';

import { getValueFromUrl, handleUrlSort } from '../utils/handleUrlFilters';
import {
  defaultSortOptions,
  generateGQLSortInput,
  getSortOptionsfromMetadata,
} from '../utils/sort';

export const ProductsHeader = ({ facets, totalCount, screenSize }) => {
  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadata = useAttributeMetadata();
  const productsCtx = useProducts();
  const translation = useTranslation();

  const [showMobileFacet, setShowMobileFacet] = useState(
    !!productsCtx.variables.filter?.length
  );
  const [sortOptions, setSortOptions] = useState(defaultSortOptions());

  const getSortOptions = useCallback(() => {
    setSortOptions(
      getSortOptionsfromMetadata(
        attributeMetadata?.sortable,
        storeCtx?.config?.displayOutOfStock,
        storeCtx?.config?.currentCategoryUrlPath,
        translation
      )
    );
  }, [storeCtx, translation, attributeMetadata]);

  useEffect(() => {
    getSortOptions();
  }, [getSortOptions]);

  const defaultSortOption = storeCtx.config?.currentCategoryUrlPath
    ? 'position_ASC'
    : 'relevance_DESC';

  const sortFromUrl = getValueFromUrl('product_list_order');
  const sortByDefault = sortFromUrl ? sortFromUrl : defaultSortOption;

  const [sortBy, setSortBy] = useState(sortByDefault);

  const onSortChange = (sortOption) => {
    setSortBy(sortOption);
    searchCtx.setSort(generateGQLSortInput(sortOption));
    handleUrlSort(sortOption);
  };

  return (
    <div className="flex flex-col max-w-5xl lg:max-w-full ml-auto w-full h-full">
      <div
        className={`flex gap-x-2.5 mb-[1px] ${
          screenSize.mobile ? 'justify-between' : 'justify-end'
        }`}
      >
        <div>
          {screenSize.mobile ? (
            totalCount > 0 && (
              <div className="pb-4">
                <FilterButton
                  displayFilter={() => setShowMobileFacet(!showMobileFacet)}
                  type="mobile"
                />
              </div>
            )
          ) : (
            storeCtx.config.displaySearchBox && (
              <SearchBar
                phrase={searchCtx.phrase}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchCtx.setPhrase(e.target.value);
                  }
                }}
                onClear={() => searchCtx.setPhrase('')}
                placeholder={translation.SearchBar.placeholder}
              />
            )
          )}
        </div>
        {totalCount > 0 && (
          <>
            {storeCtx?.config?.listview && <ViewSwitcher />}
            <SortDropdown
              sortOptions={sortOptions}
              value={sortBy}
              onChange={onSortChange}
            />
          </>
        )}
      </div>
      {screenSize.mobile && showMobileFacet && (
        <Facets searchFacets={facets} />
      )}
    </div>
  );
};
