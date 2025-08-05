// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.

// Luma Specific URL handling
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

const nonFilterKeys = {
    search: 'q',
    search_query: 'search_query',
    pagination: 'p',
    sort: 'product_list_order',
    page_size: 'page_size'
};

const addUrlFilter = filter => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    const attribute = filter.attribute;
    if (filter.range) {
        const filt = filter.range;
        if (getValueFromUrl(attribute)) {
            params.delete(attribute);
            params.append(attribute, `${filt.from}--${filt.to}`);
        } else {
            params.append(attribute, `${filt.from}--${filt.to}`);
        }
    } else {
        const filt = filter.in || [];
        const filterParams = params.getAll(attribute);
        filt.map(f => {
            if (!filterParams.includes(f)) {
                params.append(attribute, f);
            }
        });
    }
    setWindowHistory(url.pathname, params);
};

const removeUrlFilter = (name, option) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    const allValues = url.searchParams.getAll(name);
    params.delete(name);
    if (option) {
        allValues.splice(allValues.indexOf(option), 1);
        allValues.forEach(val => params.append(name, val));
    }
    setWindowHistory(url.pathname, params);
};

const removeAllUrlFilters = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    for (const key of url.searchParams.keys()) {
        if (!Object.values(nonFilterKeys).includes(key)) {
            params.delete(key);
        }
    }
    setWindowHistory(url.pathname, params);
};

const handleUrlSort = sortOption => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    params.set('product_list_order', sortOption);
    setWindowHistory(url.pathname, params);
};

const handleViewType = viewType => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    params.set('view_type', viewType);
    setWindowHistory(url.pathname, params);
};

const handleUrlPageSize = pageSizeOption => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    if (pageSizeOption === DEFAULT_PAGE_SIZE) {
        params.delete('page_size');
    } else {
        params.set('page_size', pageSizeOption.toString());
    }
    setWindowHistory(url.pathname, params);
};

const handleUrlPagination = pageNumber => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    if (pageNumber === 1) {
        params.delete('p');
    } else {
        params.set('p', pageNumber.toString());
    }
    setWindowHistory(url.pathname, params);
};

const getFiltersFromUrl = filterableAttributes => {
    const params = getSearchParams();

    const filters = [];
    for (const [key, value] of params.entries()) {
        if (
            filterableAttributes.includes(key) &&
            !Object.values(nonFilterKeys).includes(key)
        ) {
            if (value.includes('--')) {
                const range = value.split('--');
                const filter = {
                    attribute: key,
                    range: { from: Number(range[0]), to: Number(range[1]) }
                };
                filters.push(filter);
            } else {
                const attributeIndex = filters.findIndex(
                    filter => filter.attribute == key
                );
                if (attributeIndex !== -1) {
                    filters[attributeIndex].in.push(value);
                } else {
                    const filter = { attribute: key, in: [value] };
                    filters.push(filter);
                }
            }
        }
    }

    return filters;
};

const getValueFromUrl = param => {
    const params = getSearchParams();
    const filter = params.get(param);
    return filter || '';
};

const getSearchParams = () => {
    const search = window.location.search;
    return new URLSearchParams(search);
};

const setWindowHistory = (pathname, params) => {
    if (params.toString() === '') {
        window.history.pushState({}, '', `${pathname}`);
    } else {
        window.history.pushState({}, '', `${pathname}?${params.toString()}`);
    }
};

export {
    addUrlFilter,
    getFiltersFromUrl,
    getValueFromUrl,
    handleUrlPageSize,
    handleUrlPagination,
    handleUrlSort,
    handleViewType,
    removeAllUrlFilters,
    removeUrlFilter
};
