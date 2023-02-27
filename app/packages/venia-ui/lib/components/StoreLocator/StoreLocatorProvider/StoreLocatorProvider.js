import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { MP_STORE_LOCATOR_LOCATIONS } from '@magento/peregrine/lib/talons/StoreLocator/storeLocator.gql';

const StoreLocatorContext = React.createContext();

export const StoreLocatorProvider = ({ children }) => {
    const [pageSize, setPageSize] = useState(5);
    const [fetchedLocations, setFetchedLocations] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDirections, setShowDirections] = useState(false);
    const [centerCoordinates, setCenterCoordinates] = useState({
        lat: 20.9790643,
        lng: 105.7854772
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
                directionSteps
            }}
        >
            {children}
        </StoreLocatorContext.Provider>
    );
};

export const useStoreLocatorContext = () => {
    return useContext(StoreLocatorContext);
};
