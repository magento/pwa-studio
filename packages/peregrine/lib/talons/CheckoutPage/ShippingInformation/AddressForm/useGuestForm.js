import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '../../../../context/cart';

export const useGuestForm = props => {
    const {
        afterSubmit,
        mutations: { setGuestShippingMutation },
        onCancel,
        onSuccess,
        shippingData
    } = props;

    const [{ cartId }] = useCartContext();

    const [setGuestShipping, { error, loading }] = useMutation(
        setGuestShippingMutation,
        {
            onCompleted: () => {
                onSuccess();
            }
        }
    );

    const { country } = shippingData;
    const { code: countryCode } = country;

    const initialValues = {
        ...shippingData,
        country: countryCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, region, ...address } = formValues;
            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            // Cleans up the street array when values are null or undefined
                            street: address.street.filter(e => e),
                            // region_id is used for field select and region is used for field input
                            region: region.region_id || region.region,
                            country_code: country
                        }
                    }
                });
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setGuestShipping]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const errors = useMemo(
        () => new Map([['setGuestShippingMutation', error]]),
        [error]
    );

    return {
        errors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving: loading,
        isUpdate
    };
};
