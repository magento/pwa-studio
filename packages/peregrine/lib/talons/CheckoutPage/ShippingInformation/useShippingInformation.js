import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { MOCKED_ADDRESS } from '../../CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

export const useShippingInformation = props => {
    const {
        mutations: { setDefaultAddressMutation },
        onSave,
        queries: { getDefaultShippingQuery, getShippingInformationQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [hasUpdate, setHasUpdate] = useState();
    const hasLoadedData = useRef(false);

    const [
        getShippingInformation,
        {
            called: getShippingInformationCalled,
            data: getShippingInformationData,
            loading: getShippingInformationLoading
        }
    ] = useLazyQuery(getShippingInformationQuery);

    const [
        getDefaultShipping,
        {
            called: getDefaultShippingCalled,
            data: getDefaultShippingData,
            loading: getDefaultShippingLoading
        }
    ] = useLazyQuery(getDefaultShippingQuery);

    const [
        setDefaultAddress,
        { called: setDefaultAddressCalled, loading: setDefaultAddressLoading }
    ] = useMutation(setDefaultAddressMutation);

    const loading =
        (getShippingInformationCalled && getShippingInformationLoading) ||
        (getDefaultShippingCalled && getDefaultShippingLoading) ||
        (setDefaultAddressCalled && setDefaultAddressLoading);

    useEffect(() => {
        if (cartId) {
            getShippingInformation({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, getShippingInformation]);

    useEffect(() => {
        if (isSignedIn && !setDefaultAddressCalled) {
            getDefaultShipping();
        }
    }, [getDefaultShipping, isSignedIn, setDefaultAddressCalled]);

    const shippingData = useMemo(() => {
        let filteredData;
        if (getShippingInformationData) {
            const { cart } = getShippingInformationData;
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = shippingAddresses[0];
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

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [getShippingInformationData]);

    // Simple heuristic to check shipping data existed prior to this render.
    // On first submission, when we have data, we should tell the checkout page
    // so that we set the next step correctly.
    const doneEditing = !!shippingData && !!shippingData.city;

    useEffect(() => {
        if (doneEditing) {
            onSave();
        }
    }, [doneEditing, onSave]);

    useEffect(() => {
        if (shippingData !== undefined) {
            if (hasLoadedData.current) {
                setHasUpdate(true);
                setTimeout(() => {
                    setHasUpdate(false);
                }, 2000);
            } else {
                hasLoadedData.current = true;
            }
        }
    }, [hasLoadedData, shippingData]);

    useEffect(() => {
        if (!doneEditing && cartId && getDefaultShippingData) {
            const { customer } = getDefaultShippingData;
            const { default_shipping: defaultAddressId } = customer;
            if (defaultAddressId) {
                setDefaultAddress({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
            }
        }
    }, [cartId, doneEditing, getDefaultShippingData, setDefaultAddress]);

    const handleEditShipping = useCallback(() => {
        if (isSignedIn) {
            toggleActiveContent();
        } else {
            toggleDrawer('shippingInformation.edit');
        }
    }, [isSignedIn, toggleActiveContent, toggleDrawer]);

    return {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isSignedIn,
        loading,
        shippingData
    };
};
