import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useEditForm = props => {
    const {
        afterSubmit,
        mutations: { setShippingInformationMutation },
        onCancel,
        shippingData
    } = props;

    const [{ cartId }] = useCartContext();
    const [setShippingInformation, { called, loading }] = useMutation(
        setShippingInformationMutation
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
                await setShippingInformation({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            country_code: country
                        }
                    }
                });
            } catch (error) {
                console.error(error);
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setShippingInformation]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving: called && loading,
        isUpdate
    };
};
