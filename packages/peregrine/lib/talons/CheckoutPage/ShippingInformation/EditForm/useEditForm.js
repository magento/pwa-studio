import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

export const useEditForm = props => {
    const {
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

    const handleSubmit = useCallback(
        formValues => {
            const { country, email, ...address } = formValues;
            setShippingInformation({
                variables: {
                    cartId,
                    email,
                    address: {
                        ...address,
                        country_code: country
                    }
                }
            });
        },
        [cartId, setShippingInformation]
    );

    return { handleSubmit, initialValues, isSaving: called && loading };
};
