/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { SEARCH_SORT_DEFAULT } from '../utils/constants';
import {
  addUrlFilter,
  getValueFromUrl,
  removeAllUrlFilters,
  removeUrlFilter,
} from '../utils/handleUrlFilters';
import { generateGQLSortInput } from '../utils/sort';
import { useStore } from './store';

export const SearchContext = createContext({});

const SearchProvider = ({ children }) => {
  const storeCtx = useStore();
  const location = useLocation(); // watches changes in URL query params

  const getSearchPhrase = () => getValueFromUrl(storeCtx.searchQuery || 'q');
  const getSortFromUrl = () => getValueFromUrl('product_list_order');

  const [phrase, setPhrase] = useState(getSearchPhrase());
  const [categoryPath, setCategoryPath] = useState('');
  const [filters, setFilters] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [sort, setSort] = useState(generateGQLSortInput(getSortFromUrl()) || SEARCH_SORT_DEFAULT);
  const [filterCount, setFilterCount] = useState(0);

  // Update phrase and sort when URL changes
  useEffect(() => {
    setPhrase(getSearchPhrase());
    setSort(generateGQLSortInput(getSortFromUrl()) || SEARCH_SORT_DEFAULT);
  }, [location.search]);

  const createFilter = (filter) => {
    const newFilters = [...filters, filter];
    setFilters(newFilters);
    addUrlFilter(filter);
  };

  const updateFilter = (filter) => {
    const newFilters = [...filters];
    const index = newFilters.findIndex((e) => e.attribute === filter.attribute);
    newFilters[index] = filter;
    setFilters(newFilters);
    addUrlFilter(filter);
  };

  const removeFilter = (name, option) => {
    const newFilters = filters.filter((e) => e.attribute !== name);
    setFilters(newFilters);
    removeUrlFilter(name, option);
  };

  const clearFilters = () => {
    removeAllUrlFilters();
    setFilters([]);
  };

  const updateFilterOptions = (facetFilter, option) => {
    const newFilters = filters.filter((e) => e.attribute !== facetFilter.attribute);
    const newOptions = facetFilter.in?.filter((e) => e !== option);

    newFilters.push({
      attribute: facetFilter.attribute,
      in: newOptions,
    });

    if (newOptions?.length) {
      setFilters(newFilters);
      removeUrlFilter(facetFilter.attribute, option);
    } else {
      removeFilter(facetFilter.attribute, option);
    }
  };

  const getFilterCount = (filters) => {
    return filters.reduce((count, filter) => {
      return count + (filter.in ? filter.in.length : 1);
    }, 0);
  };

  useEffect(() => {
    setFilterCount(getFilterCount(filters));
  }, [filters]);

  const context = {
    phrase,
    categoryPath,
    filters,
    sort,
    categoryNames,
    filterCount,
    setPhrase,
    setCategoryPath,
    setFilters,
    setCategoryNames,
    setSort,
    createFilter,
    updateFilter,
    updateFilterOptions,
    removeFilter,
    clearFilters,
  };

  return (
    <SearchContext.Provider value={context}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => {
  return useContext(SearchContext);
};

export { SearchProvider, useSearch };
