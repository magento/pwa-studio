import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';
import { useUserContext } from '../../../../context/user';

export const useEditForm = props => {
    const {
        addressType,
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
            setDefaultAddressMutation,
            setGuestShippingMutation,
            updateCustomerAddressMutaton
        },
        onCancel,
        queries: { getCustomerAddresses },
        shippingData
    } = props;

    const [{ cartId }] = useCartContext();
    const [{ currentUser, isSignedIn }] = useUserContext();

    const [
        createCustomerAddress,
        {
            called: createCustomerAddressCalled,
            loading: createCustomerAddressLoading
        }
    ] = useMutation(createCustomerAddressMutation);

    const [
        updateCustomerAddress,
        {
            called: updateCustomerAddressCalled,
            loading: updateCustomerAddressLoading
        }
    ] = useMutation(updateCustomerAddressMutaton);

    const [
        setDefaultAddress,
        { called: setDefaultAddressCalled, loading: setDefaultAddressLoading }
    ] = useMutation(setDefaultAddressMutation);

    const [
        setGuestShipping,
        { called: setGuestShippingCalled, loading: setGuestShippingLoading }
    ] = useMutation(setGuestShippingMutation);

    const isSaving =
        (setGuestShippingCalled && setGuestShippingLoading) ||
        (createCustomerAddressCalled && createCustomerAddressLoading) ||
        (updateCustomerAddressCalled && updateCustomerAddressLoading) ||
        (setDefaultAddressCalled && setDefaultAddressLoading);

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { code: regionCode } = region;

    let initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    if (isSignedIn && !isUpdate) {
        const { email, firstname, lastname } = currentUser;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    const handleSubmit = useCallback(
        async formValues => {
            const {
                country,
                default_shipping: defaultShipping,
                email,
                region,
                ...address
            } = formValues;
            try {
                if (isSignedIn) {
                    const customerAddress = {
                        ...address,
                        country_code: country,
                        default_shipping: defaultShipping,
                        // Hard-coding region data until MC-33854/MC-33948 is resolved
                        region: {
                            region: 'Alabama',
                            region_id: 1,
                            // region_code: region
                            region_code: 'AL'
                        }
                    };

                    if (isUpdate) {
                        const { id: addressId } = shippingData;
                        await updateCustomerAddress({
                            variables: {
                                addressId,
                                address: {
                                    ...customerAddress,
                                    default_shipping: defaultShipping
                                }
                            },
                            refetchQueries: [{ query: getCustomerAddresses }]
                        });
                    } else {
                        const { data } = await createCustomerAddress({
                            variables: {
                                address: {
                                    ...customerAddress,
                                    default_shipping:
                                        addressType === 'checkout'
                                            ? true
                                            : defaultShipping
                                }
                            },
                            refetchQueries: [{ query: getCustomerAddresses }]
                        });

                        const { createCustomerAddress: addressResult } = data;
                        const { id: addressId } = addressResult;

                        // If creation originated from checkout, set address on cart
                        if (addressType === 'checkout') {
                            await setDefaultAddress({
                                variables: {
                                    cartId,
                                    addressId
                                }
                            });
                        }
                    }
                } else {
                    await setGuestShipping({
                        variables: {
                            cartId,
                            email,
                            address: {
                                ...address,
                                country_code: country,
                                region
                            }
                        }
                    });
                }
            } catch (error) {
                console.error(error);
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [
            addressType,
            afterSubmit,
            cartId,
            createCustomerAddress,
            getCustomerAddresses,
            isSignedIn,
            isUpdate,
            setDefaultAddress,
            setGuestShipping,
            shippingData,
            updateCustomerAddress
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isSignedIn,
        isUpdate
    };
};
