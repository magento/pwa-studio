import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useEditForm = props => {
    const {
        afterSubmit,
        mutations: { setShippingInformationMutation },
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

    const isUpdate = !!shippingData.email;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, ...address } = formValues;
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

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setShippingInformation]
    );

    return {
        handleSubmit,
        initialValues,
        isSaving: called && loading,
        isUpdate
    };
};
