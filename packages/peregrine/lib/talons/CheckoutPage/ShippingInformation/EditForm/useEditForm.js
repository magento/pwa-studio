import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';
import { useUserContext } from '../../../../context/user';

export const useEditForm = props => {
    const {
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
            setDefaultAddressMutation,
            setGuestShippingMutation
        },
        onCancel,
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
        setDefaultAddress,
        { called: setDefaultAddressCalled, loading: setDefaultAddressLoading }
    ] = useMutation(setDefaultAddressMutation);

    const [
        setGuestShipping,
        { called: setGuestShippingCalled, loading: setGuestShippingLoading }
    ] = useMutation(setGuestShippingMutation);

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
            const { country, email, region, ...address } = formValues;
            try {
                if (isSignedIn) {
                    const { data } = await createCustomerAddress({
                        variables: {
                            address: {
                                ...address,
                                country_code: country,
                                default_shipping: true,
                                region: {
                                    // Hard-coding a region_id until MC-33854 is resolved
                                    region_id: 1,
                                    region_code: region
                                }
                            }
                        }
                    });

                    const { createCustomerAddress: addressResult } = data;
                    const { id: addressId } = addressResult;

                    await setDefaultAddress({
                        variables: {
                            cartId,
                            addressId
                        }
                    });
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
            afterSubmit,
            cartId,
            createCustomerAddress,
            isSignedIn,
            setDefaultAddress,
            setGuestShipping
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving: setGuestShippingCalled && setGuestShippingLoading,
        isSignedIn,
        isUpdate
    };
};
