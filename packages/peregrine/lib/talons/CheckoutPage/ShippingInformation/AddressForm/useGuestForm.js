import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';

import { useCartContext } from '../../../../context/cart';

export const useGuestForm = props => {
    const {
        afterSubmit,
        mutations: { setGuestShippingMutation },
        onCancel,
        shippingData
    } = props;

    const [{ cartId }] = useCartContext();

    const [setGuestShipping, { error, loading }] = useMutation(
        setGuestShippingMutation
    );

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { code: regionCode } = region;

    const initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, ...address } = formValues;
            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
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
