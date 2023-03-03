import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { MP_STORE_LOCATOR_LOCATIONS } from '@magento/peregrine/lib/talons/StoreLocator/storeLocator.gql';
import useLocalStorage from '../useLocalStorage/useLocalStorage';

const StoreLocatorContext = React.createContext();

export const StoreLocatorProvider = ({ children }) => {
    const [pageSize, setPageSize] = useState(5);
    const [fetchedLocations, setFetchedLocations] = useState([]);
    const [mapZoom, setMapZoom] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDirections, setShowDirections] = useState(false);
    const [favoriteStores, setFavoriteStores] = useLocalStorage('favoriteStores', {});

    const [centerCoordinates, setCenterCoordinates] = useState({
        lat: 0,
        lng: 0
    });
    const [response, setResponse] = useState(null);

    //get the stores locations

    const { data: locations, error, loading } = useQuery(MP_STORE_LOCATOR_LOCATIONS, {
        variables: {
            filter: {},
            pageSize: pageSize,
            currentPage: currentPage
        }
    });

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
                setMapZoom
            }}
        >
            {children}
        </StoreLocatorContext.Provider>
    );
};

export const useStoreLocatorContext = () => {
    return useContext(StoreLocatorContext);
};
