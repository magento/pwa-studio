import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

export const useAddressBook = props => {
    const {
        mutations: { setCustomerAddressOnCartMutation },
        queries: { getCustomerAddressesQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const [
        setCustomerAddressOnCart,
        {
            error: setCustomerAddressOnCartError,
            loading: setCustomerAddressOnCartLoading
        }
    ] = useMutation(setCustomerAddressOnCartMutation);

    const {
        data: customerAddressesData,
        error: customerAddressesError,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery);

    const isLoading = customerAddressesLoading;
    const customerAddresses =
        (customerAddressesData && customerAddressesData.customer.addresses) ||
        [];

    const handleEditAddress = useCallback(
        address => {
            setActiveAddress(address);
            toggleDrawer('shippingInformation.edit');
        },
        [toggleDrawer]
    );

    const handleSelectAddress = useCallback(addressId => {
        setSelectedAddress(addressId);
    }, []);

    const handleApplyAddress = useCallback(async () => {
        await setCustomerAddressOnCart({
            variables: {
                cartId,
                addressId: selectedAddress
            }
        });

        toggleActiveContent();
    }, [
        cartId,
        selectedAddress,
        setCustomerAddressOnCart,
        toggleActiveContent
    ]);

    return {
        activeAddress,
        customerAddresses,
        isLoading,
        handleApplyAddress,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress,
        setSelectedAddress
    };
};
