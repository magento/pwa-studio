import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

const addressMap = new Map([
    ['city', 'city'],
    ['country_code', 'country.code']
]);

export const useAddressBook = props => {
    const {
        mutations: { setCustomerAddressOnCartMutation },
        queries: { getCustomerAddressesQuery, getCustomerCartAddressQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();

    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const [
        setCustomerAddressOnCart,
        { loading: setCustomerAddressOnCartLoading }
    ] = useMutation(setCustomerAddressOnCartMutation);

    const {
        data: customerAddressesData,
        error: customerAddressesError,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery);

    const {
        data: customerCartAddressData,
        error: customerCartAddressError,
        loading: customerCartAddressLoading
    } = useQuery(getCustomerCartAddressQuery);

    useEffect(() => {
        if (customerAddressesError) {
            console.error(customerAddressesError);
        }

        if (customerCartAddressError) {
            console.error(customerCartAddressError);
        }
    }, [customerAddressesError, customerCartAddressError]);

    const isLoading =
        customerAddressesLoading ||
        customerCartAddressLoading ||
        setCustomerAddressOnCartLoading;
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

    const handleAddAddress = useCallback(() => {
        handleEditAddress();
    }, [handleEditAddress]);

    const handleSelectAddress = useCallback(addressId => {
        setSelectedAddress(addressId);
    }, []);

    if (
        customerAddresses.length &&
        customerCartAddressData &&
        !selectedAddress
    ) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] === primaryCartAddress.street[0]
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
            }
        }
    }

    const handleApplyAddress = useCallback(async () => {
        try {
            await setCustomerAddressOnCart({
                variables: {
                    cartId,
                    addressId: selectedAddress
                }
            });
        } catch (error) {
            console.error(error);
        }

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
        handleAddAddress,
        handleApplyAddress,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress,
        setSelectedAddress
    };
};
