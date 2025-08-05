import React, { useContext, useEffect, useMemo, useState, useRef, createContext } from 'react';

import { getProductSearch, refineProductSearch } from '../api/search';
import {
  CATEGORY_SORT_DEFAULT,
  DEFAULT_MIN_QUERY_LENGTH,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  SEARCH_SORT_DEFAULT,
} from '../utils/constants';
import { moveToTop } from '../utils/dom';
import {
  getFiltersFromUrl,
  getValueFromUrl,
  handleUrlPagination,
} from '../utils/handleUrlFilters';
import { useAttributeMetadata } from './attributeMetadata';
import { useSearch } from './search';
import { useStore } from './store';
import { useTranslation } from './translation';
import isEqual from 'lodash/isEqual';

const ProductsContext = createContext({
  variables: { phrase: '' },
  loading: false,
  items: [],
  setItems: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: () => {},
  totalCount: 0,
  setTotalCount: () => {},
  totalPages: 0,
  setTotalPages: () => {},
  facets: [],
  setFacets: () => {},
  categoryName: '',
  setCategoryName: () => {},
  currencySymbol: '',
  setCurrencySymbol: () => {},
  currencyRate: '',
  setCurrencyRate: () => {},
  minQueryLength: DEFAULT_MIN_QUERY_LENGTH,
  minQueryLengthReached: false,
  setMinQueryLengthReached: () => {},
  pageSizeOptions: [],
  setRoute: undefined,
  refineProduct: () => {},
  pageLoading: false,
  setPageLoading: () => {},
  categoryPath: undefined,
  viewType: '',
  setViewType: () => {},
  listViewType: '',
  setListViewType: () => {},
  resolveCartId: () => Promise.resolve(''),
  refreshCart: () => {},
  addToCart: () => Promise.resolve(),
});

const ProductsContextProvider = ({ children }) => {
  const urlValue = getValueFromUrl('p');
  const pageDefault = urlValue ? Number(urlValue) : 1;

  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadataCtx = useAttributeMetadata();

  const pageSizeValue = getValueFromUrl('page_size');
  const defaultPageSizeOption =
    Number(storeCtx?.config?.perPageConfig?.defaultPageSizeOption) ||
    DEFAULT_PAGE_SIZE;
  const pageSizeDefault = pageSizeValue
    ? Number(pageSizeValue)
    : defaultPageSizeOption;

  const translation = useTranslation();
  const showAllLabel = translation.ProductContainers.showAll;

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageDefault);
  const [pageSize, setPageSize] = useState(pageSizeDefault);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [facets, setFacets] = useState([]);
  const [categoryName, setCategoryName] = useState(
    storeCtx && storeCtx.config && storeCtx.config.categoryName 
      ? storeCtx.config.categoryName 
      : ''
  );
  
  const [pageSizeOptions, setPageSizeOptions] = useState([]);
  
  const [currencySymbol, setCurrencySymbol] = useState(
    storeCtx && storeCtx.config && storeCtx.config.currencySymbol 
      ? storeCtx.config.currencySymbol 
      : ''
  );
   
  const [currencyRate, setCurrencyRate] = useState(
    storeCtx && storeCtx.config && storeCtx.config.currencyRate 
      ? storeCtx.config.currencyRate 
      : ''
  );
  
  const [minQueryLengthReached, setMinQueryLengthReached] = useState(false);

  const minQueryLength = useMemo(() => {
    return storeCtx?.config?.minQueryLength || DEFAULT_MIN_QUERY_LENGTH;
  }, [storeCtx?.config?.minQueryLength]);

  const categoryPath = storeCtx.config?.currentCategoryUrlPath;

  const viewTypeFromUrl = getValueFromUrl('view_type');
  const [viewType, setViewType] = useState(
    viewTypeFromUrl ? viewTypeFromUrl : 'gridView'
  );
  const [listViewType, setListViewType] = useState('default');

  const variables = useMemo(() => {
    const isCategoryPage = Boolean(storeCtx.config?.currentCategoryUrlPath);
    const baseSort = searchCtx.sort?.length
      ? searchCtx.sort
      : isCategoryPage
        ? CATEGORY_SORT_DEFAULT
        : SEARCH_SORT_DEFAULT;

    return {
      phrase: searchCtx.phrase,
      filter: searchCtx.filters,
      sort: baseSort,
      context: storeCtx.context,
      pageSize,
      displayOutOfStock: storeCtx.config.displayOutOfStock,
      currentPage,
      categoryPath
    };
  }, [
    searchCtx.phrase,
    searchCtx.filters,
    searchCtx.sort,
    storeCtx.context,
    storeCtx.config.displayOutOfStock,
    categoryPath,
    pageSize,
    currentPage,
  ]);

  const handleRefineProductSearch = async (optionIds, sku) => {
    const data = await refineProductSearch({ ...storeCtx, optionIds, sku });
    return data;
  };

  const context = {
    variables,
    loading,
    items,
    setItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    totalPages,
    setTotalPages,
    facets,
    setFacets,
    categoryName,
    setCategoryName,
    currencySymbol,
    setCurrencySymbol,
    currencyRate,
    setCurrencyRate,
    minQueryLength,
    minQueryLengthReached,
    setMinQueryLengthReached,
    pageSizeOptions,
    setRoute: storeCtx.route,
    refineProduct: handleRefineProductSearch,
    pageLoading,
    setPageLoading,
    categoryPath,
    viewType,
    setViewType,
    listViewType,
    setListViewType,
    cartId: storeCtx.config.resolveCartId,
    refreshCart: storeCtx.config.refreshCart,
    resolveCartId: storeCtx.config.resolveCartId,
    addToCart: storeCtx.config.addToCart,
  };

  const [hasInitialized, setHasInitialized] = useState(false);
  const prevVariablesRef = useRef();

  useEffect(() => {
    searchProducts();
    setHasInitialized(true);
    prevVariablesRef.current = variables;
  }, []);

  useEffect(() => {
    if (!hasInitialized) return;

    const hasChanged = !isEqual(prevVariablesRef.current, variables);

    if (hasChanged) {
      prevVariablesRef.current = variables;
      searchProducts();
    }
  }, [variables]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      moveToTop();
      if (checkMinQueryLength()) {
        const filters = [...variables.filter];

        handleCategorySearch(categoryPath, filters);

        const data = await getProductSearch({
          ...variables,
          ...storeCtx,
          apiUrl: storeCtx.apiUrl,
          filter: filters,
          categorySearch: !!categoryPath,
        });

        setItems(data?.productSearch?.items || []);
        setFacets(data?.productSearch?.facets || []);
        setTotalCount(data?.productSearch?.total_count || 0);
        setTotalPages(data?.productSearch?.page_info?.total_pages || 1);
        handleCategoryNames(data?.productSearch?.facets || []);

        getPageSizeOptions(data?.productSearch?.total_count);

        paginationCheck(
          data?.productSearch?.total_count,
          data?.productSearch?.page_info?.total_pages
        );
      }
      setLoading(false);
      setPageLoading(false);
    } catch (error) {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const checkMinQueryLength = () => {
    if (
      !storeCtx.config?.currentCategoryUrlPath &&
      searchCtx.phrase.trim().length <
        (Number(storeCtx.config.minQueryLength) || DEFAULT_MIN_QUERY_LENGTH)
    ) {
      setItems([]);
      setFacets([]);
      setTotalCount(0);
      setTotalPages(1);
      setMinQueryLengthReached(false);
      return false;
    }
    setMinQueryLengthReached(true);
    return true;
  };

  const getPageSizeOptions = (totalCount) => {
    const optionsArray = [];
    const pageSizeString =
      storeCtx?.config?.perPageConfig?.pageSizeOptions ||
      DEFAULT_PAGE_SIZE_OPTIONS;
    const pageSizeArray = pageSizeString.split(',');
    pageSizeArray.forEach((option) => {
      optionsArray.push({
        label: option,
        value: parseInt(option, 10),
      });
    });

    if (storeCtx?.config?.allowAllProducts == '1') {
      optionsArray.push({
        label: showAllLabel,
        value: totalCount !== null ? (totalCount > 500 ? 500 : totalCount) : 0,
      });
    }
    setPageSizeOptions(optionsArray);
  };

  const paginationCheck = (totalCount, totalPages) => {
    if (totalCount && totalCount > 0 && totalPages === 1) {
      setCurrentPage(1);
      handleUrlPagination(1);
    }
  };

  const handleCategorySearch = (categoryPath, filters) => {
    if (categoryPath) {
      const categoryFilter = {
        attribute: 'categoryPath',
        eq: categoryPath,
      };
      filters.push(categoryFilter);
    }
  };

  const handleCategoryNames = (facets) => {
    facets.map((facet) => {
      const bucketType = facet?.buckets[0]?.__typename;
      if (bucketType === 'CategoryView') {
        const names = facet.buckets.map((bucket) => {
          if (bucket.__typename === 'CategoryView')
            return {
              name: bucket.name,
              id: bucket.id,
            };
        });
        setCategoryName(names?.[0]?.name);
      }
    });
  };

  return (
    <ProductsContext.Provider value={context}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => useContext(ProductsContext);

export { ProductsContextProvider, useProducts };