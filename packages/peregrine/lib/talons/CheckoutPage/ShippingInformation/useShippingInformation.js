import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from './shippingInformation.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { MOCKED_ADDRESS } from '../../CartPage/PriceAdjustments/ShippingMethods/useShippingForm';
import { useEventingContext } from '../../../context/eventing';

export const useShippingInformation = props => {
    const { onSave, toggleActiveContent } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [hasUpdate, setHasUpdate] = useState(false);
    const hasLoadedData = useRef(false);

    const {
        setDefaultAddressOnCartMutation,
        getDefaultShippingQuery,
        getShippingInformationQuery
    } = operations;

    const {
        data: shippingInformationData,
        loading: getShippingInformationLoading
    } = useQuery(getShippingInformationQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const [fetchDefaultShipping, { data: defaultShippingData, loading: getDefaultShippingLoading }] = useLazyQuery(getDefaultShippingQuery);

    useEffect(() => {
        if (isSignedIn) {
            fetchDefaultShipping();
        }
    }, [isSignedIn, fetchDefaultShipping]);

    const [setDefaultAddressOnCart, { loading: setDefaultAddressLoading }] = useMutation(setDefaultAddressOnCartMutation);

    const isLoading =
        getShippingInformationLoading ||
        getDefaultShippingLoading ||
        setDefaultAddressLoading;

    const shippingData = useMemo(() => {
        if (!shippingInformationData) return undefined;

        const { cart } = shippingInformationData;
        const { email, shipping_addresses: shippingAddresses } = cart;

        if (!shippingAddresses.length) return undefined;

        const primaryAddress = { ...shippingAddresses[0] };

        for (const field in MOCKED_ADDRESS) {
            if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                primaryAddress[field] = '';
            }

            if (
                field === 'street' &&
                primaryAddress[field][0] === MOCKED_ADDRESS[field][0]
            ) {
                primaryAddress[field] = [''];
            }
        }

        const regionData = primaryAddress.region || {};
        const { region_id, label: region, code: region_code } = regionData;

        primaryAddress.region = { region_code, region_id, region };

        return {
            email,
            ...primaryAddress
        };
    }, [shippingInformationData]);

    const doneEditing = !!shippingData && !!shippingData.city;
    const [, { dispatch }] = useEventingContext();

    useEffect(() => {
        if (doneEditing) {
            onSave();
        }
    }, [doneEditing, onSave]);

    useEffect(() => {
        let updateTimer;

        if (shippingData) {
            if (hasLoadedData.current) {
                setHasUpdate(true);
                updateTimer = setTimeout(() => setHasUpdate(false), 2000);
            } else {
                hasLoadedData.current = true;
            }
        }

        return () => clearTimeout(updateTimer);
    }, [shippingData]);

    useEffect(() => {
        const defaultAddressId = defaultShippingData?.customer?.default_shipping;

        if (shippingInformationData && !doneEditing && cartId && defaultAddressId) {
            setDefaultAddressOnCart({
                variables: {
                    cartId,
                    addressId: parseInt(defaultAddressId)
                }
            });
        }
    }, [
        cartId,
        doneEditing,
        defaultShippingData,
        setDefaultAddressOnCart,
        shippingInformationData
    ]);

    const handleEditShipping = useCallback(() => {
        if (isSignedIn) {
            toggleActiveContent();
        } else {
            toggleDrawer('shippingInformation.edit');
        }
    }, [isSignedIn, toggleActiveContent, toggleDrawer]);

    useEffect(() => {
        if (doneEditing && hasUpdate) {
            dispatch({
                type: 'CHECKOUT_SHIPPING_INFORMATION_UPDATED',
                payload: { cart_id: cartId }
            });
        }
    }, [cartId, doneEditing, dispatch, hasUpdate]);

    return {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isLoading,
        isSignedIn,
        shippingData
    };
};
