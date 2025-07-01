/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import mse from '@adobe/magento-storefront-events-sdk';

const updateSearchInputCtx = (
    searchUnitId,
    searchRequestId,
    phrase,
    filters,
    pageSize,
    currentPage,
    sort
) => {
    if (!mse) {
        // don't break search if events are broken/not loading
        return;
    }
  
    const searchInputResult = mse.context.getSearchInput();
    const searchInputCtx =
        searchInputResult !== null && searchInputResult !== undefined
            ? searchInputResult
            : { units: [] };

    const searchInputUnit = {
        searchUnitId,
        searchRequestId,
        queryTypes: ['products', 'suggestions'],
        phrase,
        pageSize,
        currentPage,
        filter: filters,
        sort
    };

    const searchInputUnitIndex = searchInputCtx.units.findIndex(
        unit => unit.searchUnitId === searchUnitId
    );

    if (searchInputUnitIndex < 0) {
        searchInputCtx.units.push(searchInputUnit);
    } else {
        searchInputCtx.units[searchInputUnitIndex] = searchInputUnit;
    }

    mse.context.setSearchInput(searchInputCtx);
};

const updateSearchResultsCtx = (searchUnitId, searchRequestId, results) => {
    const mse = window.magentoStorefrontEvents;
    if (!mse) {
        return;
    }

    const searchResultsResult = mse.context.getSearchResults();
    const searchResultsCtx =
        searchResultsResult !== null && searchResultsResult !== undefined
            ? searchResultsResult
            : { units: [] };

    const searchResultUnitIndex = searchResultsCtx.units.findIndex(
        unit => unit.searchUnitId === searchUnitId
    );

    const searchResultUnit = {
        searchUnitId,
        searchRequestId,
        products: createProducts(results.items),
        categories: [],
        suggestions: createSuggestions(results.suggestions),
        page: results?.page_info?.current_page || 1,
        perPage: results?.page_info?.page_size || 20,
        facets: createFacets(results.facets)
    };

    if (searchResultUnitIndex < 0) {
        searchResultsCtx.units.push(searchResultUnit);
    } else {
        searchResultsCtx.units[searchResultUnitIndex] = searchResultUnit;
    }

    mse.context.setSearchResults(searchResultsCtx);
};

const createProducts = items => {
    if (!items) {
        return [];
    }

    return items.map((item, index) => ({
        name: item && item.product && item.product.name,
        sku: item && item.product && item.product.sku,
        url:
            item &&
            item.product &&
            item.product.canonical_url !== undefined &&
            item.product.canonical_url !== null
                ? item.product.canonical_url
                : '',
        imageUrl:
            item &&
            item.productView &&
            Array.isArray(item.productView.images) &&
            item.productView.images.length
                ? item.productView.images[0].url !== undefined &&
                  item.productView.images[0].url !== null
                    ? item.productView.images[0].url
                    : ''
                : '',
        price:
            item &&
            item.productView &&
            item.productView.price &&
            item.productView.price.final &&
            item.productView.price.final.amount &&
            item.productView.price.final.amount.value !== undefined &&
            item.productView.price.final.amount.value !== null
                ? item.productView.price.final.amount.value
                : item &&
                  item.product &&
                  item.product.price_range &&
                  item.product.price_range.minimum_price &&
                  item.product.price_range.minimum_price.final_price &&
                  item.product.price_range.minimum_price.final_price.value,
        rank: index
    }));
};

const createSuggestions = items => {
    if (!items) {
        return [];
    }

    return items.map((suggestion, index) => ({
        suggestion,
        rank: index
    }));
};

const createFacets = items => {
    if (!items) {
        return [];
    }

    return items.map(item => ({
        attribute: item?.attribute,
        title: item?.title,
        type: item?.type || 'PINNED',
        buckets: item?.buckets.map(bucket => bucket)
    }));
};

export { updateSearchInputCtx, updateSearchResultsCtx };
