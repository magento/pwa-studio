import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useAutocomplete, Popover, LiveSearch } from '@magento/storefront-search-as-you-type';
import { Form } from 'informed';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../styles/searchBar.module.css';
import autoCompleteClasses from '../styles/autocomplete.module.css';
import { useLiveSearchPopoverConfig } from '../hooks/useLiveSearchPopoverConfig';
import { Search as SearchIcon } from 'react-feather';

const LiveSearchPopoverLoader = () => {
    const classes = useStyle(defaultClasses);
    const history = useHistory();
    const [isPopoverVisible, setPopoverVisible] = useState(false);

    const {
        storeDetails,
        configReady,
        storeLoading,
        customerLoading,
        storeError
    } = useLiveSearchPopoverConfig();

    //const liveSearch = useMemo(() => new LiveSearch(storeDetails), [storeDetails]);
    const liveSearch = useMemo(() => {
        if (!storeDetails || Object.keys(storeDetails).length === 0) return null;
        return new LiveSearch(storeDetails);
    }, [JSON.stringify(storeDetails)]);

    const {
    performSearch,
    minQueryLength,
    currencySymbol
} = liveSearch ? liveSearch : {
    performSearch: () => Promise.resolve({}),
    minQueryLength: 3,
    currencySymbol: '$'
};


    const {
        formProps,
        formRef,
        inputProps,
        inputRef,
        results,
        resultsRef,
        loading: searchLoading,
        searchTerm
    } = useAutocomplete(performSearch, minQueryLength);

    const transformResults = originalResults => {
        if (!originalResults?.data?.productSearch?.items) return originalResults;

        const cleanUrl = url =>
                url?.replace(storeDetails.baseUrlwithoutProtocol, '');
        
        const transformedItems = originalResults.data.productSearch.items.map(item => {
            const product = item.product;
            if (!product) return item;

            return {
                ...item,
                product: {
                    ...product,
                    canonical_url: cleanUrl(product.canonical_url),
                    image: { ...product.image, url: cleanUrl(product.image?.url) },
                    small_image: { ...product.small_image, url: cleanUrl(product.small_image?.url) },
                    thumbnail: { ...product.thumbnail, url: cleanUrl(product.thumbnail?.url) }
                }
            };
        });

        return {
            ...originalResults,
            data: {
                ...originalResults.data,
                productSearch: {
                    ...originalResults.data.productSearch,
                    items: transformedItems
                }
            }
        };
    };

    const modifiedResults = transformResults(results);
    inputRef.current = document.getElementById('search_query');
    formRef.current = document.getElementById('search-autocomplete-form');

    const getSearchStatusMessage = () => {
        if (!searchTerm) return 'Search for a product';

        if (searchTerm.length < minQueryLength) {
            return `Search term must be at least ${minQueryLength} characters`;
        }

        if (searchLoading) {
            return 'Fetching results...';
        }

        if (
            searchTerm.length >= minQueryLength &&
            !searchLoading &&
            modifiedResults?.data?.productSearch?.items?.length === 0
        ) {
            return 'No results were found.';
        }

        return null;
    };

    const searchStatusMessage = getSearchStatusMessage();

    useEffect(() => {
        if (searchTerm.length >= minQueryLength) {
            setPopoverVisible(true);
        }
    }, [searchTerm, minQueryLength]);

    const handleSubmit = useCallback(
        event => {
            const query = inputRef.current?.value;
            if (query) {
                setPopoverVisible(false);
                history.push(`/search.html?query=${query}`);
            }
        },
        [history, inputRef]
    );

    if (!configReady) return null; // Or a loading spinner

    return (
        <Form
            autoComplete="off"
            className={classes.form}
            id="search-autocomplete-form"
            {...formProps}
            action="/search.html"
            onSubmit={handleSubmit}
        >
            <div className={classes.search}>
                <TextInput
                    id="search_query"
                    before={<SearchIcon />}
                    field="query"
                    data-cy="SearchField-textInput"
                    {...inputProps}
                />
                <div data-cy="Autocomplete-root" className={autoCompleteClasses.root_visible}>
                    {searchStatusMessage && (
                        <label
                            id="search_query_label"
                            data-cy="Autocomplete-message"
                            className={classes.message}
                        >
                            {searchStatusMessage}
                        </label>
                    // <div className={classes.message}>
                    //     {searchStatusMessage}
                    // </div>
                    )}
                    <div
                        id="search_autocomplete"
                        className={`${classes.suggestions} ${classes.popover}`}
                    >
                        {searchTerm &&
                        !searchLoading &&
                        results &&
                        isPopoverVisible && (
                            <Popover
                                active={searchTerm.length >= minQueryLength}
                                response={modifiedResults}
                                formRef={formRef}
                                resultsRef={resultsRef}
                                inputRef={inputRef}
                                pageSize={storeDetails.config.pageSize}
                                currencySymbol={currencySymbol}
                                currencyRate={storeDetails.config.currencyRate}
                                minQueryLengthHit={
                                    searchTerm.length >= minQueryLength
                                }
                                searchRoute={storeDetails.searchRoute}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default LiveSearchPopoverLoader;
