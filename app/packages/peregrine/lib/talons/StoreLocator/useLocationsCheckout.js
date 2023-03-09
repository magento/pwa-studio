/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useMemo } from 'react';
import mergeOperations from '../../util/shallowMerge';
import { useMutation, useQuery } from '@apollo/client';
import defaultOperations from './storeLocator.gql';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '../../context/cart';
import { useIntl } from 'react-intl';

export const useLocationsCheckout = () => {
    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();
    const operations = mergeOperations(defaultOperations);
    const { formatMessage } = useIntl();

    const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedDay, setSelectedDay] = useState();
    const { getLocationsCart, submitLocation, getLocationHolidays, getStoreId } = operations;

    const { data, loading } = useQuery(getLocationsCart, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { data: storeData } = useQuery(getStoreId, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { data: locationsHolidays, loading: holidaysLoading } = useQuery(getLocationHolidays, {
        variables: { storeId: storeData?.storeConfig?.id },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const [handleSubmitLocation, { loading: isSubmtiting }] = useMutation(submitLocation);

    const locationsData = useMemo(() => data?.MpStoreLocatorPickupLocationList, [data]);

    const holidayDates = useMemo(() => {
        if (selectedLocation) {
            const location = locationsHolidays?.MpStoreLocatorConfig?.locationsData.find(
                ({ name }) => selectedLocation?.name === name
            );
            return location ? location?.holidayData : [];
        }
    }, [selectedLocation, locationsHolidays]);

    const handleOpenLocationModal = () => {
        setIsLocationsModalOpen(!isLocationsModalOpen);
        setSelectedLocation();
    };

    const handleChangeDay = val => setSelectedDay(val);

    const handleSelectLocation = location => setSelectedLocation(location);

    const submutLocation = useCallback(async () => {
        try {
            await handleSubmitLocation({
                variables: {
                    locationId: selectedLocation?.location_id,
                    timePickup: selectedDay
                }
            });
            setIsLocationsModalOpen(false);
            setSelectedLocation({ ...selectedLocation, isSubmited: true, selectedDay });
            addToast({
                type: 'success',

                message: formatMessage({
                    id: 'storeLocation.AddedSuccessfully',
                    defaultMessage: 'Added the store successfully'
                }),
                timeout: 6000
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'quickOrder.somethingWentWrongTryAgainLater',
                    defaultMessage: 'something went wrong, try again later'
                }),
                timeout: 6000
            });
        }
    }, [handleSubmitLocation, selectedDay, selectedLocation]);

    return {
        isLocationsModalOpen,
        handleOpenLocationModal,
        loading: loading || isSubmtiting || holidaysLoading,
        locationsData,
        submutLocation,
        selectedLocation,
        handleSelectLocation,
        holidayDates,
        handleChangeDay
    };
};
