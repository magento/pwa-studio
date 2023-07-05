/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { MP_STORE_LOCATOR_LOCATIONS } from '@magento/peregrine/lib/talons/StoreLocator/storeLocator.gql';
import useLocalStorage from '../useLocalStorage/useLocalStorage';

const StoreLocatorContext = React.createContext();

export const StoreLocatorProvider = ({ children }) => {
    const [pageSize] = useState(5);
    const [fetchedLocations, setFetchedLocations] = useState([]);
    const [mapZoom, setMapZoom] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDirections, setShowDirections] = useState(false);
    const [favoriteStores, setFavoriteStores] = useLocalStorage('favoriteStores', {});
    const [selectedLocation, setSelectedLocation] = useState();
    const [searchValue, setSearchValue] = useState('');

    const [centerCoordinates, setCenterCoordinates] = useState({
        lat: 0,
        lng: 0
    });
    const [response, setResponse] = useState(null);

    const [openSearchModal, setOpenSearchModal] = useState(false);
    //get the stores locations
    const [formSearch, setFormSearch] = useState();

    const formProps = {
        initialValues: formSearch
    };
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [runQuery, queryResponse] = useLazyQuery(MP_STORE_LOCATOR_LOCATIONS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            filter: {},
            pageSize: pageSize,
            currentPage: currentPage
        }
    });
    const { data: locations, loading: locationsLoading } = queryResponse;
    // useEffect(() => {
    //     runQuery();
    // }, []);
    //Total Count

    const totalCount = useMemo(() => {
        if (fetchedLocations) return fetchedLocations?.MpStoreLocatorLocations?.total_count;
    }, [fetchedLocations]);

    //Total Pages

    const handleTotalPages = useCallback(() => {
        setTotalPage(Math.ceil(totalCount / pageSize));
    }, [pageSize, totalCount]);

    useEffect(() => {
        if (locations) setFetchedLocations(locations);
        handleTotalPages();
    }, [fetchedLocations, handleTotalPages, locations]);

    //Get only the items in the locations

    const locationsItems = useMemo(() => {
        if (fetchedLocations) return fetchedLocations?.MpStoreLocatorLocations?.items;
    }, [fetchedLocations]);

    // Handle next page

    const handleCurrentPage = useCallback(value => {
        setCurrentPage(value);
    }, []);

    //Set Directions

    const directionsCallback = useCallback(res => {
        try {
            if (res !== null) {
                setResponse(res);
            }
        } catch (error) {
            console.log('error', error);
        }
    }, []);

    //Direction steps

    const directionSteps = response?.routes[0]?.legs[0];

    // Page control

    const pageControl = {
        currentPage: currentPage,
        setPage: handleCurrentPage,
        totalPages: totalPage
    };

    useEffect(() => {
        if (favoriteStores === null || Object.keys(favoriteStores).length === 0) {
            setCenterCoordinates({ lat: 0, lng: 0 });
        } else {
            setCenterCoordinates({ lat: +favoriteStores?.lat, lng: +favoriteStores?.lng });
        }
    }, [favoriteStores]);

    const submitSearch = apiValue => {
        const values = {};
        Object.keys(apiValue).map(key => (values[key] = apiValue[key]));
        setFormSearch(values);
        try {
            const filter = {};
            Object.keys(apiValue).map(key => (filter[key] = { eq: apiValue[key] }));
            runQuery({
                variables: {
                    filter,
                    pageSize,
                    currentPage
                }
            });
            setOpenSearchModal(false);
        } catch (error) {
            setOpenSearchModal(false);
        }
    };
    const resetSearch = useCallback(() => {
        formApiRef.current.reset();
        setFormSearch();
        runQuery({
            variables: {
                pageSize,
                currentPage
            }
        });
        setOpenSearchModal(false);
    }, []);

    return (
        <StoreLocatorContext.Provider
            value={{
                locationsItems,
                currentPage,
                handleCurrentPage,
                pageControl,
                showDirections,
                setShowDirections,
                centerCoordinates,
                setCenterCoordinates,
                directionsCallback,
                response,
                setResponse,
                directionSteps,
                favoriteStores,
                setFavoriteStores,
                mapZoom,
                setMapZoom,
                openSearchModal,
                setOpenSearchModal,
                submitSearch,
                formProps,
                setFormApi,
                locationsLoading,
                resetSearch,
                searchValue,
                setSearchValue,
                selectedLocation,
                setSelectedLocation
            }}
        >
            {children}
        </StoreLocatorContext.Provider>
    );
};

export const useStoreLocatorContext = () => {
    return useContext(StoreLocatorContext);
};
